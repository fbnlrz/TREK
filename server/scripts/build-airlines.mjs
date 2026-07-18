#!/usr/bin/env node
// Build server/assets/airlines.json — the carrier designator database that turns a
// booking's airline name + flight number into a real flight number and ATC call
// sign (e.g. "Austrian Airlines" + "254" -> OS254 / AUA254).
//
// Sources, merged:
//   1. Wikidata (CC0) — every item carrying an IATA (P229) or ICAO (P230) airline
//      designator, with dissolution dates (P576), sitelink counts and en/de
//      labels + aliases. Current and maintained.
//   2. OpenFlights (ODbL) — frozen at ~2014, but contributes historical aliases
//      and trade names Wikidata lacks.
//
// Neither source alone is sufficient: OpenFlights is missing current carriers
// outright (Loganair) or lacks their IATA code (VietJet), while Wikidata misses
// some colloquial spellings that travel agents print on confirmations.
//
// Designator conflicts are the hard part. IATA codes are recycled years after an
// airline folds, and a mainline carrier shares its code with its regional and
// cargo arms (Lufthansa, Lufthansa Regional and Lufthansa Cargo are all "LH").
// A passenger holding an LH ticket is on mainline DLH, not GEC — so rather than
// last-write-wins, every claimant is scored and the most plausible one owns the
// code. Name lookup is unaffected: all spellings stay searchable, so
// "lufthansa cargo" still resolves to LH.
//
// Output shape (consumed by server/src/services/airlineService.ts):
//   { nameToIata: { <normalised name|alias>: IATA },
//     nameToIcao: { <normalised name|alias>: ICAO },   // covers ICAO-only carriers
//     iataToIcao: { IATA: ICAO },
//     icaoToIata: { ICAO: IATA },
//     names:      { IATA: <display name> },
//     callsigns:  { ICAO: <ATC call sign> } }
//
// Run: node scripts/build-airlines.mjs
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'assets', 'airlines.json');
const WIKIDATA = 'https://query.wikidata.org/sparql';
const OPENFLIGHTS = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat';
const UA = 'TREK-flight-tracker-dataset-build/1.0 (https://github.com/mauriceboe/TREK)';

// Curated designators win over every source and over scoring — the handful of
// codes where the "obvious" answer matters most and we refuse to guess.
const CURATED_IATA = {
  austrian: 'OS', 'austrian airlines': 'OS', lufthansa: 'LH', swiss: 'LX',
  eurowings: 'EW', 'brussels airlines': 'SN', 'air france': 'AF', klm: 'KL',
  'british airways': 'BA', iberia: 'IB', vueling: 'VY', ryanair: 'FR',
  easyjet: 'U2', 'wizz air': 'W6', 'turkish airlines': 'TK', emirates: 'EK',
  'qatar airways': 'QR', etihad: 'EY', 'etihad airways': 'EY', united: 'UA',
  'united airlines': 'UA', 'american airlines': 'AA', delta: 'DL', 'delta air lines': 'DL',
  'ita airways': 'AZ', alitalia: 'AZ', condor: 'DE', sas: 'SK', finnair: 'AY',
  norwegian: 'DY', 'tap air portugal': 'TP', 'aer lingus': 'EI', aegean: 'A3',
  'lot polish airlines': 'LO', transavia: 'HV', edelweiss: 'WK', sunexpress: 'XQ',
  // Group names that resolve to a subsidiary on notability alone: bare "LATAM"
  // otherwise lands on LATAM Paraguay (PZ) rather than the LA mainline.
  latam: 'LA', 'latam airlines': 'LA', 'latam airlines group': 'LA',
  'riyadh air': 'RX', scoot: 'TR', play: 'OG',
};
const CURATED_ICAO = {
  OS: 'AUA', LH: 'DLH', LX: 'SWR', EW: 'EWG', SN: 'BEL', AF: 'AFR', KL: 'KLM', BA: 'BAW',
  IB: 'IBE', VY: 'VLG', FR: 'RYR', U2: 'EZY', W6: 'WZZ', TK: 'THY', EK: 'UAE', QR: 'QTR',
  EY: 'ETD', UA: 'UAL', AA: 'AAL', DL: 'DAL', AZ: 'ITY', DE: 'CFG', SK: 'SAS', AY: 'FIN',
  DY: 'NAX', TP: 'TAP', EI: 'EIN', A3: 'AEE', LO: 'LOT', HV: 'TRA', WK: 'EDW', XQ: 'SXS',
  // Codes where two live carriers tie on notability and the tiebreaker would
  // otherwise pick the wrong one: RX (Riyadh Air vs Regent Airways), TR (Scoot's
  // current TGW vs its legacy SCO), LA (LATAM mainline).
  RX: 'RXI', TR: 'TGW', LA: 'LAN',
};

const SPARQL = `
SELECT ?item ?itemLabel ?iata ?icao ?callsign ?dissolved ?sitelinks
       (GROUP_CONCAT(DISTINCT ?alias; separator="|") AS ?aliases) WHERE {
  { ?item wdt:P229 ?iata. } UNION { ?item wdt:P230 ?icao. }
  OPTIONAL { ?item wdt:P229 ?iata. }
  OPTIONAL { ?item wdt:P230 ?icao. }
  OPTIONAL { ?item wdt:P432 ?callsign. }
  OPTIONAL { ?item wdt:P576 ?dissolved. }
  OPTIONAL { ?item wikibase:sitelinks ?sitelinks. }
  OPTIONAL { ?item skos:altLabel ?alias. FILTER(LANG(?alias) IN ("en","de")) }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
GROUP BY ?item ?itemLabel ?iata ?icao ?callsign ?dissolved ?sitelinks`;

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': UA, ...headers } }, res => {
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        let data = '';
        res.setEncoding('utf8');
        res.on('data', c => { data += c; });
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

// airlines.dat is CSV with quoted fields; \N means null.
function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else quoted = false;
      } else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out.map(v => (v === '\\N' ? '' : v.trim()));
}

// Match however a booking spells the airline: case-, diacritic- and
// punctuation-insensitive ("Aerolíneas Argentinas" == "aerolineas argentinas").
function normName(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const IATA_RE = /^[A-Z0-9]{2}$/;
const ICAO_RE = /^[A-Z]{3}$/;

// Wikidata labels are sometimes disambiguated ("Mango (airline)").
const cleanLabel = s => String(s || '').replace(/\s*\([^)]*\)\s*$/, '').trim();

/**
 * How plausible is it that this carrier is the one a traveller means when their
 * ticket shows this designator? Sitelink count is the notability proxy that
 * separates mainline Lufthansa (101 sitelinks) from Lufthansa Regional (25).
 */
function score(r) {
  let s = 0;
  if (!r.dissolved) s += 10_000; // a living airline always beats a defunct one
  if (r.source === 'wikidata') s += 1_000; // current data beats 2014 data
  if (r.iata && r.icao) s += 100; // a complete record beats a partial one
  if (r.corroborated) s += 50; // both sources agree this pairing is real
  if (r.callsign) s += 20; // an ATC call sign means it actually operates
  s += Math.min(r.sitelinks || 0, 500); // notability
  return s;
}

/**
 * Keep the higher-scoring claimant for a designator. Exact ties are common —
 * Riyadh Air and Regent Airways both hold IATA "RX" with identical notability —
 * so break them on the designator pair and then the name. Any stable rule would
 * do; what matters is that it is deterministic, otherwise the generated asset
 * churns between builds for no reason.
 */
function claim(map, key, rec) {
  if (!key) return;
  const cur = map.get(key);
  if (!cur) return void map.set(key, rec);
  const d = score(rec) - score(cur);
  if (d > 0) return void map.set(key, rec);
  if (d < 0) return;
  const tie = `${rec.icao}${rec.iata}${rec.name}`.localeCompare(`${cur.icao}${cur.iata}${cur.name}`);
  if (tie < 0) map.set(key, rec);
}

const records = [];

// --- 1. OpenFlights ----------------------------------------------------------
let ofCount = 0;
try {
  for (const line of (await get(OPENFLIGHTS)).split('\n')) {
    if (!line.trim()) continue;
    const [, name, alias, iata, icao, callsign, , active] = parseCsvLine(line);
    if (!name) continue;
    const ia = (iata || '').toUpperCase();
    const ic = (icao || '').toUpperCase();
    if (!IATA_RE.test(ia) && !ICAO_RE.test(ic)) continue;
    records.push({
      name,
      aliases: alias ? [alias] : [],
      iata: IATA_RE.test(ia) ? ia : '',
      icao: ICAO_RE.test(ic) ? ic : '',
      callsign: callsign || '',
      dissolved: active !== 'Y',
      sitelinks: 0,
      source: 'openflights',
    });
    ofCount++;
  }
} catch (err) {
  console.warn(`[airlines] OpenFlights unavailable (${err.message}) — continuing with Wikidata only`);
}

// --- 2. Wikidata -------------------------------------------------------------
const wd = JSON.parse(
  await get(`${WIKIDATA}?query=${encodeURIComponent(SPARQL)}`, {
    Accept: 'application/sparql-results+json',
  })
);
let wdCount = 0;
for (const r of wd.results.bindings) {
  const ia = (r.iata?.value || '').toUpperCase();
  const ic = (r.icao?.value || '').toUpperCase();
  if (!IATA_RE.test(ia) && !ICAO_RE.test(ic)) continue;
  records.push({
    name: cleanLabel(r.itemLabel?.value),
    aliases: (r.aliases?.value || '').split('|').map(cleanLabel).filter(Boolean),
    iata: IATA_RE.test(ia) ? ia : '',
    icao: ICAO_RE.test(ic) ? ic : '',
    callsign: r.callsign?.value || '',
    dissolved: !!r.dissolved,
    sitelinks: Number(r.sitelinks?.value || 0),
    source: 'wikidata',
  });
  wdCount++;
}

// --- 3. Resolve designator ownership by score --------------------------------
// A pairing both sources independently list is far more likely to be the live
// one than a pairing only Wikidata's historical record carries.
const pairings = new Map(); // "IATA/ICAO" -> Set of sources
for (const r of records) {
  if (!r.iata || !r.icao) continue;
  const k = `${r.iata}/${r.icao}`;
  if (!pairings.has(k)) pairings.set(k, new Set());
  pairings.get(k).add(r.source);
}
for (const r of records) {
  r.corroborated = !!(r.iata && r.icao && pairings.get(`${r.iata}/${r.icao}`)?.size > 1);
}

const iataOwner = new Map(); // IATA -> best record
const icaoOwner = new Map(); // ICAO -> best record
for (const r of records) {
  claim(iataOwner, r.iata, r);
  claim(icaoOwner, r.icao, r);
}

// --- 4. Build the indexes ----------------------------------------------------
// Name lookup keeps EVERY carrier and spelling — a defunct airline still has to
// resolve, because bookings and archived trips reference it. Only the reverse
// designator maps use the scored winner.
const nameToIata = {};
const nameToIcao = {};
const iataToIcao = {};
const icaoToIata = {};
const names = {};
const callsigns = {};

// Weakest first so better records overwrite: defunct before living, OpenFlights
// before Wikidata, low notability before high.
const byStrength = [...records].sort((a, b) => score(a) - score(b));
for (const r of byStrength) {
  for (const n of [r.name, ...r.aliases]) {
    const k = normName(n);
    if (!k) continue;
    if (r.iata) nameToIata[k] = r.iata;
    if (r.icao) nameToIcao[k] = r.icao;
  }
}

for (const [iata, r] of iataOwner) {
  if (r.name) names[iata] = r.name;
  if (r.icao) iataToIcao[iata] = r.icao;
}
for (const [icao, r] of icaoOwner) {
  if (r.iata) icaoToIata[icao] = r.iata;
  if (r.callsign) callsigns[icao] = r.callsign;
}
// A call sign is worth keeping even when it came from a lower-scoring record.
for (const r of byStrength) if (r.icao && r.callsign && !callsigns[r.icao]) callsigns[r.icao] = r.callsign;

// --- 5. Curated overrides win over everything --------------------------------
for (const [k, v] of Object.entries(CURATED_IATA)) nameToIata[normName(k)] = v;
for (const [k, v] of Object.entries(CURATED_ICAO)) { iataToIcao[k] = v; icaoToIata[v] = k; }

delete nameToIata[''];
delete nameToIcao[''];

const sortKeys = o => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
const out = {
  nameToIata: sortKeys(nameToIata),
  nameToIcao: sortKeys(nameToIcao),
  iataToIcao: sortKeys(iataToIcao),
  icaoToIata: sortKeys(icaoToIata),
  names: sortKeys(names),
  callsigns: sortKeys(callsigns),
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(
  `[airlines] wrote ${OUT}\n` +
    `  sources: OpenFlights ${ofCount} rows, Wikidata ${wdCount} rows\n` +
    `  ${Object.keys(out.nameToIata).length} names -> IATA, ` +
    `${Object.keys(out.nameToIcao).length} names -> ICAO\n` +
    `  ${Object.keys(out.names).length} IATA carriers, ` +
    `${Object.keys(out.icaoToIata).length} ICAO carriers, ` +
    `${Object.keys(out.callsigns).length} call signs`
);
