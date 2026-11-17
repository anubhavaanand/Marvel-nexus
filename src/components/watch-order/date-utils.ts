'use client'

/**
 * Format a date string using Intl.DateTimeFormat with explicit UTC timezone
 * to avoid timezone drift. Returns formatted date string or null if input is null/undefined.
 */
export function formatReleaseDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null

  try {
    // Parse as UTC to avoid timezone drift
    const date = new Date(`${dateStr}T00:00:00Z`)
    // Check if date is valid
    if (isNaN(date.getTime())) return null

    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  } catch {
    return null
  }
}

/**
 * Format a date string to just the year using Intl.DateTimeFormat with UTC.
 */
export function formatReleaseYear(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null

  try {
    const date = new Date(`${dateStr}T00:00:00Z`)
    if (isNaN(date.getTime())) return null

    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
    }).format(date)
  } catch {
    return null
  }
}
