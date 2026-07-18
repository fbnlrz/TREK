import { useState } from 'react'
import { render, screen, waitFor } from '../../../tests/helpers/render'
import userEvent from '@testing-library/user-event'
import type { AirlineSuggestion } from '@trek/shared'
import AirlineSelect from './AirlineSelect'

const search = vi.fn()

// Partial mock: the module also holds the shared axios instance other imports need.
vi.mock('../../api/client', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  airlinesApi: { search: (...a: unknown[]) => search(...a) },
}))

const lufthansa: AirlineSuggestion = { iata: 'LH', icao: 'DLH', name: 'Lufthansa', callsign: 'LUFTHANSA' }

/** Wrapper mirroring how TransportModal binds the field: a plain string value. */
function Harness({ initial = '', onValue }: { initial?: string; onValue?: (v: string) => void }) {
  const [value, setValue] = useState(initial)
  return (
    <>
      <AirlineSelect value={value} onChange={(v) => { setValue(v); onValue?.(v) }} />
      <output data-testid="stored">{value}</output>
    </>
  )
}

const stored = () => screen.getByTestId('stored').textContent

beforeEach(() => {
  search.mockReset()
  search.mockResolvedValue([])
})

describe('AirlineSelect', () => {
  it('suggests airlines and shows their code', async () => {
    search.mockResolvedValue([lufthansa])
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(screen.getByRole('combobox'), 'luft')
    await waitFor(() => expect(screen.getByRole('option', { name: /Lufthansa/ })).toBeInTheDocument())
    expect(screen.getByText('LH')).toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: /Lufthansa/ }))
    expect(stored()).toBe('Lufthansa')
    // Picking must not immediately re-open the list with the name we just wrote.
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
  })

  it('falls back to the ICAO code when an airline has no IATA code', async () => {
    search.mockResolvedValue([{ iata: null, icao: 'ABX', name: 'ABX Air', callsign: null }])
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(screen.getByRole('combobox'), 'abx')
    await waitFor(() => expect(screen.getByText('ABX')).toBeInTheDocument())
  })

  it('keeps free text that matches no airline', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(screen.getByRole('combobox'), 'Some Charter Co')
    await waitFor(() => expect(search).toHaveBeenCalled())

    // Every keystroke is committed upward, so the typed value is already stored.
    expect(stored()).toBe('Some Charter Co')
    // …and the dropdown offers it explicitly instead of only "no results".
    expect(await screen.findByRole('option', { name: /Some Charter Co/ })).toBeInTheDocument()
    expect(screen.getByText('No airlines found')).toBeInTheDocument()
  })

  it('keeps free text after the custom row is confirmed and the list closes', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(screen.getByRole('combobox'), 'Ghost Air')
    const custom = await screen.findByRole('option', { name: /Ghost Air/ })
    await user.click(custom)

    expect(stored()).toBe('Ghost Air')
    expect(screen.getByRole('combobox')).toHaveValue('Ghost Air')
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
  })

  it('keeps free text when the lookup fails', async () => {
    search.mockRejectedValue(new Error('offline'))
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(screen.getByRole('combobox'), 'Nowhere Airways')
    await waitFor(() => expect(search).toHaveBeenCalled())
    expect(stored()).toBe('Nowhere Airways')
  })

  it('keeps an existing stored value that is not in the list', async () => {
    render(<Harness initial="Legacy Airline Ltd" />)
    expect(screen.getByRole('combobox')).toHaveValue('Legacy Airline Ltd')
    expect(stored()).toBe('Legacy Airline Ltd')
  })

  it('debounces the lookup to one call per pause', async () => {
    search.mockResolvedValue([lufthansa])
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(screen.getByRole('combobox'), 'lufthansa')
    await waitFor(() => expect(search).toHaveBeenCalledTimes(1))
    expect(search.mock.calls[0][0]).toBe('lufthansa')
  })

  it('is keyboard navigable', async () => {
    search.mockResolvedValue([lufthansa, { iata: 'LX', icao: 'SWR', name: 'Swiss', callsign: 'SWISS' }])
    const user = userEvent.setup()
    render(<Harness />)

    const input = screen.getByRole('combobox')
    await user.type(input, 'l')
    await user.type(input, 'u')
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(3)) // 2 airlines + custom row

    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(input).toHaveAttribute('aria-activedescendant')
    await user.keyboard('{Enter}')
    expect(stored()).toBe('Swiss')
  })

  it('does not search for a query shorter than two characters', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(screen.getByRole('combobox'), 'l')
    await new Promise(r => setTimeout(r, 300))
    expect(search).not.toHaveBeenCalled()
    expect(stored()).toBe('l')
  })

  it('clears the value', async () => {
    const user = userEvent.setup()
    render(<Harness initial="Lufthansa" />)

    await user.click(screen.getByRole('button', { name: /clear/i }))
    expect(stored()).toBe('')
  })
})
