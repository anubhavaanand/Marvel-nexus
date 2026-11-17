/**
 * MCU phase mapping, shared by the app (src/lib/tmdb.ts) and Node scripts.
 *
 * Plain CommonJS on purpose: `node scripts/*.js` cannot load TypeScript, and the
 * two implementations drifted apart before (#436).
 *
 * Rules mirror the SQL timeline buckets:
 *   Phase 1: May 2008 - May 2012
 *   Phase 2: May 2013 - July 2015
 *   Phase 3: May 2016 - July 2019
 *   Phase 4: July 2021 - November 2022
 *   Phase 5: February 2023 - November 2024
 *   Phase 6: 2025+
 * Invalid/missing dates return null so they land in "Unphased" instead of
 * silently becoming Phase 6 (#461).
 */
function getMCUPhase(releaseDate) {
  if (!releaseDate) return null
  const date = new Date(releaseDate)
  if (Number.isNaN(date.getTime())) return null
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  if (year < 2012 || (year === 2012 && month <= 5)) return 'Phase 1'
  if (year <= 2015 && (year < 2015 || month <= 7)) return 'Phase 2'
  if (year <= 2019 && (year < 2019 || month <= 7)) return 'Phase 3'
  if (year <= 2022) return 'Phase 4'
  if (year <= 2024) return 'Phase 5'
  return 'Phase 6'
}

module.exports = { getMCUPhase }
