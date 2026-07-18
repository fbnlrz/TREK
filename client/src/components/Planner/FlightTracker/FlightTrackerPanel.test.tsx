import { render, screen, waitFor } from '../../../../tests/helpers/render'
import userEvent from '@testing-library/user-event'
import { useSettingsStore } from '../../../store/settingsStore'
import { resetAllStores, seedStore } from '../../../../tests/helpers/store'
import type { FlightTrackerPayload, TrackedFlightLeg } from '@trek/shared'
import FlightTrackerPanel from './FlightTrackerPanel'

const status = vi.fn()
const refresh = vi.fn()
const setNumber = vi.fn()

// Partial mock: the store helpers pull the real axios client in transitively.
vi.mock('../../../api/client', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  flightTrackerApi: {
    status: (...a: unknown[]) => status(...a),
    refresh: (...a: unknown[]) => refresh(...a),
    setNumber: (...a: unknown[]) => setNumber(...a),
    tripStatus: vi.fn(),
  },
}))

const airport = (over: Record<string, unknown> = {}) => ({
  iata: 'FRA', name: 'Frankfurt', terminal: null, gate: null, baggageBelt: null,
  scheduled: null, revised: null, scheduledUtc: null, revisedUtc: null, lat: null, lon: null,
  ...over,
})

const buildLeg = (over: Partial<TrackedFlightLeg> = {}): TrackedFlightLeg => ({
  number: 'LH400', callsign: 'DLH400', airline: 'Lufthansa', from: 'FRA', to: 'JFK',
  depTime: null, arrTime: null, seat: null, live: null, weather: null, inbound: null,
  errors: [],
  status: {
    number: 'LH400', callSign: 'DLH400', status: 'Expected', airline: 'Lufthansa',
    aircraftModel: null, aircraftReg: null, delayMin: null,
    departure: airport({ scheduled: '2026-07-18 10:00+02:00', terminal: '1', gate: 'A14' }),
    arrival: airport({ iata: 'JFK', name: 'John F. Kennedy', scheduled: '2026-07-18 13:00-04:00' }),
  },
  ...over,
})

const buildPayload = (over: Partial<FlightTrackerPayload> = {}): FlightTrackerPayload => ({
  applicable: true,
  source: 'stored',
  hasKey: true,
  legs: [buildLeg()],
  booking: {
    type: 'flight', depMs: Date.now() + 3 * 3600_000, arrMs: Date.now() + 12 * 3600_000,
    phase: 'active', pnr: 'ABC123', origin: 'FRA', dest: 'JFK', legCount: 1,
  },
  updatedAt: Date.now(),
  ...over,
})

const props = { tripId: 1, reservationId: 7, reservationType: 'flight' }

beforeEach(() => {
  resetAllStores()
  seedStore(useSettingsStore, { settings: { time_format: '24h', temperature_unit: 'celsius', language: 'en' } })
  status.mockReset().mockResolvedValue(buildPayload())
  refresh.mockReset().mockResolvedValue(buildPayload())
  setNumber.mockReset().mockResolvedValue(buildPayload())
})

describe('FlightTrackerPanel', () => {
  it('renders nothing at all for a non-flight reservation', async () => {
    const { container } = render(<FlightTrackerPanel {...props} reservationType="hotel" />)
    expect(container).toBeEmptyDOMElement()
    expect(status).not.toHaveBeenCalled()
  })

  it('never fetches for trains, hotels, cars or ferries', () => {
    for (const type of ['train', 'hotel', 'car', 'ferry']) {
      render(<FlightTrackerPanel {...props} reservationType={type} />)
    }
    expect(status).not.toHaveBeenCalled()
  })

  it('renders the route, times and status chip of a leg', async () => {
    render(<FlightTrackerPanel {...props} />)
    expect(await screen.findByText('FRA')).toBeInTheDocument()
    expect(screen.getByText('JFK')).toBeInTheDocument()
    expect(screen.getByText('LH 400')).toBeInTheDocument()
    // flightTracker.status.Expected = 'Scheduled'
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
  })

  it('shows terminal and gate pills', async () => {
    render(<FlightTrackerPanel {...props} />)
    expect(await screen.findByText('A14')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('collapses to nothing when the server says the reservation is not applicable', async () => {
    status.mockResolvedValue(buildPayload({ applicable: false, legs: [] }))
    const { container } = render(<FlightTrackerPanel {...props} />)
    await waitFor(() => expect(status).toHaveBeenCalled())
    await waitFor(() => expect(container).toBeEmptyDOMElement())
  })

  it('offers manual entry when no flight number could be detected', async () => {
    status.mockResolvedValue(buildPayload({
      legs: [],
      hint: [{ airline: 'Lufthansa', from: 'FRA', to: 'JFK', rawFlight: null }],
    }))
    render(<FlightTrackerPanel {...props} />)
    expect(await screen.findByText(/Couldn't read a flight number/)).toBeInTheDocument()
    expect(screen.getByLabelText('Flight number')).toBeInTheDocument()
  })

  it('saves a manually entered flight number', async () => {
    status.mockResolvedValue(buildPayload({ legs: [] }))
    const user = userEvent.setup()
    render(<FlightTrackerPanel {...props} />)
    const input = await screen.findByLabelText('Flight number')
    await user.type(input, 'LH400')
    await user.click(screen.getByRole('button', { name: 'Link' }))
    await waitFor(() => expect(setNumber).toHaveBeenCalledWith(1, 7, 'LH400'))
  })

  it('re-detects by clearing the override with an empty flight number', async () => {
    const user = userEvent.setup()
    render(<FlightTrackerPanel {...props} />)
    await user.click(await screen.findByRole('button', { name: 'Re-detect flights from booking' }))
    await waitFor(() => expect(setNumber).toHaveBeenCalledWith(1, 7, ''))
  })

  it('forces a rebuild from the refresh button', async () => {
    const user = userEvent.setup()
    render(<FlightTrackerPanel {...props} />)
    await user.click(await screen.findByRole('button', { name: 'Refresh' }))
    await waitFor(() => expect(refresh).toHaveBeenCalledWith(1, 7))
  })

  it('opens the edit row prefilled with the current number', async () => {
    const user = userEvent.setup()
    render(<FlightTrackerPanel {...props} />)
    await user.click(await screen.findByRole('button', { name: 'Change flight number' }))
    expect(await screen.findByLabelText('Flight number')).toHaveValue('LH 400')
  })

  it('shows the admin key hint when no AeroDataBox key is configured', async () => {
    status.mockResolvedValue(buildPayload({ hasKey: false }))
    render(<FlightTrackerPanel {...props} />)
    expect(await screen.findByText(/No AeroDataBox key configured/)).toBeInTheDocument()
  })

  it('hides the key hint once a key is configured', async () => {
    render(<FlightTrackerPanel {...props} />)
    await screen.findByText('FRA')
    expect(screen.queryByText(/No AeroDataBox key configured/)).not.toBeInTheDocument()
  })

  it('shows a cancellation banner instead of a countdown', async () => {
    status.mockResolvedValue(buildPayload({
      legs: [buildLeg({ status: { ...buildLeg().status!, status: 'Cancelled' } })],
    }))
    render(<FlightTrackerPanel {...props} />)
    expect(await screen.findByText(/LH 400 Cancelled/)).toBeInTheDocument()
    expect(screen.queryByText('Departs in')).not.toBeInTheDocument()
  })

  it('counts down to the next departure', async () => {
    const dep = new Date(Date.now() + 3 * 3600_000 + 10 * 60_000).toISOString()
    status.mockResolvedValue(buildPayload({
      legs: [buildLeg({ status: { ...buildLeg().status!, departure: airport({ scheduled: dep }) } })],
    }))
    render(<FlightTrackerPanel {...props} />)
    expect(await screen.findByText(/Departs in/)).toBeInTheDocument()
    expect(screen.getByText(/3 h/)).toBeInTheDocument()
  })

  it('renders a journey header and a layover for a multi-leg booking', async () => {
    const first = buildLeg({
      number: 'LH100', to: 'MUC',
      status: { ...buildLeg().status!, number: 'LH100', arrival: airport({ iata: 'MUC', scheduled: '2026-07-18T10:00:00Z' }) },
    })
    const second = buildLeg({
      number: 'LH400', from: 'MUC',
      status: { ...buildLeg().status!, departure: airport({ iata: 'MUC', scheduled: '2026-07-18T12:00:00Z' }) },
    })
    status.mockResolvedValue(buildPayload({ legs: [first, second] }))
    render(<FlightTrackerPanel {...props} />)
    expect(await screen.findByText(/2 legs/)).toBeInTheDocument()
    expect(screen.getByText(/ABC123/)).toBeInTheDocument()
    expect(screen.getByText(/Layover in MUC/)).toBeInTheDocument()
  })

  it('warns about a connection that is already broken', async () => {
    const first = buildLeg({
      number: 'LH100', to: 'MUC',
      status: { ...buildLeg().status!, number: 'LH100', arrival: airport({ iata: 'MUC', scheduled: '2026-07-18T12:00:00Z' }) },
    })
    const second = buildLeg({
      number: 'LH400', from: 'MUC',
      status: { ...buildLeg().status!, departure: airport({ iata: 'MUC', scheduled: '2026-07-18T11:30:00Z' }) },
    })
    status.mockResolvedValue(buildPayload({ legs: [first, second] }))
    render(<FlightTrackerPanel {...props} />)
    expect(await screen.findByText(/connection at risk/)).toBeInTheDocument()
  })

  it('renders the live stat grid when the aircraft has an ADS-B fix', async () => {
    status.mockResolvedValue(buildPayload({
      legs: [buildLeg({
        status: { ...buildLeg().status!, status: 'EnRoute' },
        live: {
          hex: '3c4b26', callSign: 'DLH400', reg: 'D-AIHK', type: 'A346', desc: 'Airbus A340-600',
          lat: 51.2, lon: -20.4, altBaro: 35000, groundSpeed: 480, track: 285,
          verticalRate: 0, squawk: null, onGround: false, seenPos: 4,
        },
      })],
    }))
    render(<FlightTrackerPanel {...props} />)
    expect(await screen.findByText(/In the air/)).toBeInTheDocument()
    expect(screen.getByText('35,000 ft')).toBeInTheDocument()
    expect(screen.getByText('480 kt')).toBeInTheDocument()
    expect(screen.getByText('D-AIHK')).toBeInTheDocument()
  })

  it('explains a coverage gap when the schedule says airborne but no fix arrived', async () => {
    status.mockResolvedValue(buildPayload({
      legs: [buildLeg({ status: { ...buildLeg().status!, status: 'EnRoute' }, live: null })],
    }))
    render(<FlightTrackerPanel {...props} />)
    expect(await screen.findByText(/out of ADS-B coverage/)).toBeInTheDocument()
  })

  it('collapses finished legs of a long journey and expands one on click', async () => {
    const done = (n: string, from: string, to: string) => buildLeg({
      number: n, from, to,
      status: {
        ...buildLeg().status!, number: n, status: 'Arrived',
        departure: airport({ iata: from }), arrival: airport({ iata: to }),
      },
    })
    status.mockResolvedValue(buildPayload({
      legs: [done('LH100', 'FRA', 'MUC'), done('LH200', 'MUC', 'DXB'), buildLeg({ from: 'DXB', to: 'SYD' })],
    }))
    const user = userEvent.setup()
    render(<FlightTrackerPanel {...props} />)
    const collapsed = await screen.findAllByRole('button', { name: 'Show details' })
    expect(collapsed).toHaveLength(2)
    await user.click(collapsed[0])
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'Show details' })).toHaveLength(1))
  })

  it('keeps the last good payload when a later poll fails', async () => {
    render(<FlightTrackerPanel {...props} />)
    await screen.findByText('LH 400')
    status.mockRejectedValue(new Error('offline'))
    const user = userEvent.setup()
    refresh.mockRejectedValue(new Error('offline'))
    await user.click(screen.getByRole('button', { name: 'Refresh' }))
    await waitFor(() => expect(refresh).toHaveBeenCalled())
    expect(screen.getByText('LH 400')).toBeInTheDocument()
  })

  it('shows a retryable error when the very first load fails', async () => {
    status.mockRejectedValue(new Error('offline'))
    render(<FlightTrackerPanel {...props} />)
    expect(await screen.findByText(/Flight status could not be loaded/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('surfaces per-provider errors under the legs', async () => {
    status.mockResolvedValue(buildPayload({ errors: ['Schedule data unavailable'] }))
    render(<FlightTrackerPanel {...props} />)
    expect(await screen.findByText('Schedule data unavailable')).toBeInTheDocument()
  })

  it('marks a detected flight number in the footer', async () => {
    status.mockResolvedValue(buildPayload({ source: 'detected' }))
    render(<FlightTrackerPanel {...props} />)
    expect(await screen.findByText(/Detected from booking/)).toBeInTheDocument()
  })
})
