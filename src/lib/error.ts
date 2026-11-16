/**
 * Never ships raw error text to the UI. Logs the full error server-side
 * (when called from a server context such as a server action or server
 * component) and returns a fixed, generic message instead.
 *
 * Supabase / provider error messages frequently contain schema names,
 * constraint details, and policy hints that assist reconnaissance, so they
 * must never reach the client.
 */

const DEFAULT_SAFE_MESSAGE = 'Something went wrong. Please try again.'

// Allowlist of client-facing copy that is safe to surface. Anything not on
// this list (and not an obviously clean caller-supplied fallback) is replaced
// with the default generic message so provider/upstream details cannot leak.
const SAFE_ERROR_MESSAGES = new Set<string>([
  DEFAULT_SAFE_MESSAGE,
  'Operation failed',
  'No data',
  "We couldn't load this reality. Please try again.",
  'Database connection failed',
  'Hero seed failed',
  'Movie seed failed',
  'Canon events seed failed',
  'Movie sync failed',
  'Canon events creation failed',
  'Failed to load admin stats',
  'Connection failed',
  'Database query failed',
])

const PROVIDER_MARKERS = [
  'supabase',
  'postgres',
  'relation',
  'constraint',
  'schema',
  'violates',
  'duplicate key',
  'stack',
]

export function isSafeErrorMessage(message: string): boolean {
  return SAFE_ERROR_MESSAGES.has(message)
}

function redactedErrorSummary(error: unknown): string {
  if (error instanceof Error) {
    const name = error.constructor?.name || 'Error'
    const code = (error as { code?: unknown }).code
    return code != null ? `${name} (code: ${String(code)})` : name
  }
  return typeof error
}

export function getSafeErrorMessage(error: unknown, fallback = DEFAULT_SAFE_MESSAGE): string {
  if (error) {
    console.error('Error suppressed from UI:', redactedErrorSummary(error))
  }

  const candidate = typeof fallback === 'string' ? fallback : DEFAULT_SAFE_MESSAGE

  const raw = error instanceof Error ? error.message : typeof error === 'string' ? error : null

  // Never echo the raw/upstream text back, even if a caller passes it as the
  // fallback.
  if (raw && (candidate === raw || candidate.includes(raw))) {
    return DEFAULT_SAFE_MESSAGE
  }

  const lower = candidate.toLowerCase()
  if (PROVIDER_MARKERS.some((m) => lower.includes(m))) {
    return DEFAULT_SAFE_MESSAGE
  }

  // Prefer the allowlist when present, but keep clean caller-supplied copy.
  if (SAFE_ERROR_MESSAGES.has(candidate)) {
    return candidate
  }

  return candidate || DEFAULT_SAFE_MESSAGE
}
