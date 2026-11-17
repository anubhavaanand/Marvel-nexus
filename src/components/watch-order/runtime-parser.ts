'use client'

/**
 * Tolerant runtime parser for watch-order entries.
 * Supports variants like: '2h 30m', '1h', '45m', '1h 5m', '2h30m', '90min', '1h30min'
 * Returns { minutes: number; parsed: boolean; original: string }
 * If unparseable, returns { minutes: 0; parsed: false; original }
 */
export function parseRuntime(runtime?: string): {
  minutes: number
  parsed: boolean
  original: string
} {
  if (!runtime) {
    return { minutes: 0, parsed: false, original: '' }
  }

  const original = runtime.trim()
  if (!original) {
    return { minutes: 0, parsed: false, original }
  }

  // Match patterns: Xh Ym, Xh, Ym, Xh Ymin, XhYm, etc.
  // Accepts: h, hour, hours, m, min, mins, minute, minutes
  const hourMatch = original.match(/(\d+)\s*(?:h|hour|hours)/i)
  const minuteMatch = original.match(/(\d+)\s*(?:m(?:in(?:s)?)?|minute|minutes)/i)

  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0
  const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0

  // If neither hours nor minutes matched, it's unparseable
  if (!hourMatch && !minuteMatch) {
    return { minutes: 0, parsed: false, original }
  }

  // Validate reasonable bounds: minutes only capped when paired with hours
  if (hours > 24 || (hours === 0 && minutes > 360)) {
    return { minutes: 0, parsed: false, original }
  }

  return { minutes: hours * 60 + minutes, parsed: true, original }
}

/**
 * Parses an array of runtimes, returning total minutes and unparseable entries.
 */
export function parseRuntimes(runtimes: (string | undefined)[]): {
  totalMinutes: number
  unparseable: Array<{ original: string; index: number }>
} {
  let totalMinutes = 0
  const unparseable: Array<{ original: string; index: number }> = []

  runtimes.forEach((runtime, index) => {
    const result = parseRuntime(runtime)
    if (result.parsed) {
      totalMinutes += result.minutes
    } else if (runtime && runtime.trim()) {
      unparseable.push({ original: runtime.trim(), index })
    }
  })

  return { totalMinutes, unparseable }
}
