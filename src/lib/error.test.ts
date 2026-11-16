import { describe, expect, it, vi } from 'vitest'
import { getSafeErrorMessage } from './error'

describe('getSafeErrorMessage', () => {
  it('returns the fallback message for any error', () => {
    expect(getSafeErrorMessage(new Error('relation "heroes" does not exist'))).toBe(
      'Something went wrong. Please try again.',
    )
  })

  it('never returns the raw error text, even when a fallback is supplied', () => {
    const raw = 'duplicate key value violates unique constraint "heroes_pkey"'
    expect(getSafeErrorMessage(raw, 'Operation failed')).not.toBe(raw)
    expect(getSafeErrorMessage(raw, 'Operation failed')).toBe('Operation failed')
  })

  it('returns the fallback when error is null or undefined', () => {
    expect(getSafeErrorMessage(null)).toBe('Something went wrong. Please try again.')
    expect(getSafeErrorMessage(undefined, 'No data')).toBe('No data')
  })

  it('logs the raw error to the console so it is not silently lost', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    getSafeErrorMessage(new Error('schema leak'))
    expect(spy).toHaveBeenCalledWith('Error suppressed from UI:', expect.any(Error))
    spy.mockRestore()
  })
})
