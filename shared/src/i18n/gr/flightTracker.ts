import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Κατάσταση πτήσης',
  'flightTracker.subtitle': 'Ζωντανό πρόγραμμα και θέση',
  'flightTracker.loading': 'Φόρτωση κατάστασης πτήσης…',
  'flightTracker.noFlight': 'Δεν έχει συνδεθεί αριθμός πτήσης με αυτήν την κράτηση.',
  'flightTracker.couldntDetect': 'Δεν ήταν δυνατή η ανάγνωση του αριθμού πτήσης — καταχώρισέ τον:',
  'flightTracker.numberLabel': 'Αριθμός πτήσης',
  'flightTracker.numberPlaceholder': 'Αρ. πτήσης (π.χ. LH400)',
  'flightTracker.link': 'Σύνδεση',
  'flightTracker.save': 'Αποθήκευση',
  'flightTracker.cancel': 'Ακύρωση',
  'flightTracker.changeNumber': 'Αλλαγή αριθμού πτήσης',
  'flightTracker.redetect': 'Νέος εντοπισμός πτήσεων από την κράτηση',
  'flightTracker.redetected': 'Εντοπίστηκε ξανά από την κράτηση',
  'flightTracker.detected': 'Εντοπίστηκε από την κράτηση',
  'flightTracker.refresh': 'Ανανέωση',
  'flightTracker.refreshing': 'Ανανέωση…',
  'flightTracker.showDetails': 'Εμφάνιση λεπτομερειών',
  'flightTracker.hideDetails': 'Απόκρυψη λεπτομερειών',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Ενημερώθηκε',
  'flightTracker.updatedJustNow': 'μόλις τώρα',
  'flightTracker.updatedSeconds': 'πριν {count} δευτ.',
  'flightTracker.updatedMinutes': 'πριν {count} λεπτά',
  'flightTracker.updatedHours': 'πριν {count} ώρες',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Αναχώρηση',
  'flightTracker.arrival': 'Άφιξη',
  'flightTracker.terminal': 'Τερματικός σταθμός',
  'flightTracker.gate': 'Πύλη',
  'flightTracker.baggageBelt': 'Ιμάντας',
  'flightTracker.seat': 'Θέση',
  'flightTracker.scheduled': 'Προγραμματισμένη',
  'flightTracker.revised': 'Αναμενόμενη',
  'flightTracker.onTime': 'Στην ώρα της',
  'flightTracker.delayLate': 'καθυστέρηση',
  'flightTracker.delayEarly': 'νωρίτερα',
  'flightTracker.yourTime': 'η ώρα σου',
  'flightTracker.boardingAround': 'Επιβίβαση ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'Στον αέρα',
  'flightTracker.onGround': 'Στο έδαφος',
  'flightTracker.altitude': 'Υψόμετρο',
  'flightTracker.groundSpeed': 'Ταχύτητα εδάφους',
  'flightTracker.aircraft': 'Αεροσκάφος',
  'flightTracker.registration': 'Νηολόγιο',
  'flightTracker.heading': 'Πορεία',
  'flightTracker.noSignal': 'Η θέση είναι προσωρινά εκτός κάλυψης ADS-B',
  'flightTracker.inbound': 'Το αεροσκάφος καταφθάνει',
  'flightTracker.remainingIn': 'σε',
  'flightTracker.percentFlown': '{percent}% της διαδρομής',
  'flightTracker.kmToGo': 'απομένουν {count} χλμ',
  'flightTracker.openOnMap': 'Άνοιγμα στον χάρτη',
  'flightTracker.externalTracker': 'Άνοιγμα στο globe.adsb.fi',
  'flightTracker.unitFeet': 'πόδια',
  'flightTracker.unitKnots': 'κόμβοι',
  'flightTracker.unitKm': 'χλμ',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Αναχωρεί σε',
  'flightTracker.unitDayOne': '{count} ημέρα',
  'flightTracker.unitDayMany': '{count} ημέρες',
  'flightTracker.unitHour': 'ώ',
  'flightTracker.unitMinute': 'λ',
  'flightTracker.upcomingHint': 'Η ζωντανή κατάσταση εμφανίζεται ~48 ώρες πριν την αναχώρηση.',
  'flightTracker.noStatus': 'Δεν υπάρχει ζωντανό πρόγραμμα αυτή τη στιγμή.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Ταξίδι',
  'flightTracker.legOne': '{count} σκέλος',
  'flightTracker.legMany': '{count} σκέλη',
  'flightTracker.totalDuration': '{duration} συνολικά',
  'flightTracker.bookingRef': 'Κωδικός κράτησης',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Ενδιάμεση στάση',
  'flightTracker.layoverAt': 'Ενδιάμεση στάση στο {airport}',
  'flightTracker.layoverTight': 'στενή ανταπόκριση',
  'flightTracker.layoverBroken': 'η ανταπόκριση κινδυνεύει',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'Προγραμματισμένη',
  'flightTracker.status.Unknown': 'Προγραμματισμένη',
  'flightTracker.status.CheckIn': 'Έλεγχος εισιτηρίων',
  'flightTracker.status.GateClosed': 'Η πύλη έκλεισε',
  'flightTracker.status.Boarding': 'Επιβίβαση',
  'flightTracker.status.Departed': 'Απογειώθηκε',
  'flightTracker.status.EnRoute': 'Σε πορεία',
  'flightTracker.status.Approaching': 'Πλησιάζει',
  'flightTracker.status.Arrived': 'Προσγειώθηκε',
  'flightTracker.status.Delayed': 'Καθυστερεί',
  'flightTracker.status.Canceled': 'Ακυρώθηκε',
  'flightTracker.status.Cancelled': 'Ακυρώθηκε',
  'flightTracker.status.Diverted': 'Εκτράπηκε',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'Δεν ήταν δυνατή η φόρτωση της κατάστασης πτήσης.',
  'flightTracker.error.save': 'Δεν ήταν δυνατή η αποθήκευση του αριθμού πτήσης.',
  'flightTracker.error.retry': 'Δοκίμασε ξανά',
  'flightTracker.error.schedule': 'Τα δεδομένα προγράμματος δεν είναι διαθέσιμα',
  'flightTracker.error.live': 'Η ζωντανή θέση δεν είναι διαθέσιμη',
  'flightTracker.error.invalidNumber': 'Αυτό δεν μοιάζει με αριθμό πτήσης.',
  'flightTracker.error.rateLimited': 'Πάρα πολλά αιτήματα — δοκίμασε ξανά σε λίγο.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Πρόσθεσε ένα κλειδί AeroDataBox για πρόγραμμα, πύλη και καθυστερήσεις.',
  'flightTracker.key.missing':
    'Δεν έχει ρυθμιστεί κλειδί AeroDataBox — ένας διαχειριστής του TREK μπορεί να το προσθέσει στις ρυθμίσεις διαχείρισης για να ξεκλειδώσει δεδομένα προγράμματος, πύλης και καθυστέρησης.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Παρακολούθηση πτήσεων',
  'flightTracker.admin.hint':
    'Το AeroDataBox (μέσω RapidAPI) παρέχει προγράμματα, πύλες, τερματικούς σταθμούς και καθυστερήσεις για τις αεροπορικές κρατήσεις. Οι ζωντανές θέσεις προέρχονται από το adsb.fi και δεν χρειάζονται κλειδί.',
  'flightTracker.admin.keyLabel': 'Κλειδί API AeroDataBox',
  'flightTracker.admin.keyPlaceholder': 'Επικόλλησε το κλειδί RapidAPI',
  'flightTracker.admin.keyActive': 'Το κλειδί AeroDataBox είναι ενεργό',
  'flightTracker.admin.keyNotSet': 'Δεν έχει ρυθμιστεί κλειδί',
  'flightTracker.admin.keySaved': 'Το κλειδί AeroDataBox αποθηκεύτηκε',
  'flightTracker.admin.keyCleared': 'Το κλειδί AeroDataBox αφαιρέθηκε',
  'flightTracker.admin.keyRemove': 'Αφαίρεση',
  'flightTracker.admin.keyReplace': 'Αντικατάσταση',
  'flightTracker.admin.keySaveError': 'Δεν ήταν δυνατή η αποθήκευση του κλειδιού.',
  'flightTracker.admin.keyHelp': 'Πάρε δωρεάν κλειδί στο rapidapi.com/aedbx-aedbx/api/aerodatabox.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Αεροπορική εταιρεία',
  'flightTracker.airline.placeholder': 'Όνομα ή κωδικός εταιρείας (π.χ. LH)',
  'flightTracker.airline.searching': 'Αναζήτηση…',
  'flightTracker.airline.noResults': 'Δεν βρέθηκε αεροπορική εταιρεία',
  'flightTracker.airline.useCustom': 'Χρήση «{query}»',
  'flightTracker.airline.customHint': 'Δεν είναι στη λίστα; Το κείμενό σου διατηρείται ακριβώς όπως γράφτηκε.',
  'flightTracker.airline.clear': 'Καθαρισμός εταιρείας',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Ζωντανή θέση',
  'flightTracker.map.flight': 'Πτήση {number}',
  'flightTracker.map.altitude': 'Υψόμετρο',
  'flightTracker.map.speed': 'Ταχύτητα',
  'flightTracker.map.heading': 'Πορεία',
  'flightTracker.map.registration': 'Νηολόγιο',
  'flightTracker.map.route': 'Διαδρομή',
  'flightTracker.map.flown': 'Διανυθέν',
  'flightTracker.map.remaining': 'Υπόλοιπο',
  'flightTracker.map.lastSeen': 'Τελευταία επαφή πριν {age}',
  'flightTracker.map.toggle': 'Πτήσεις',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Ενημέρωση πτήσης',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': 'Η {flight} καθυστερεί {minutes} λεπτά',
  'flightTracker.notif.gateChanged': '{flight}: πύλη {gate}',
  'flightTracker.notif.cancelled': 'Η {flight} ακυρώθηκε',
  'flightTracker.notif.action': 'Προβολή κράτησης',
  'flightTracker.notif.pref': 'Αλλαγές κατάστασης πτήσης',
};
export default flightTracker;
