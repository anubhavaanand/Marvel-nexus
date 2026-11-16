/**
 * Never ships raw error text to the UI. Logs the full error server-side
 * (when called from a server context such as a server action or server
 * component) and returns a fixed, generic message instead.
 *
 * Supabase / provider error messages frequently contain schema names,
 * constraint details, and policy hints that assist reconnaissance, so they
 * must never reach the client.
 */
export function getSafeErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (error) {
    console.error('Error suppressed from UI:', error)
  }
  return fallback
}
