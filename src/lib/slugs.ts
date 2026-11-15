/**
 * Shared hero slug helpers.
 *
 * Link creation (HeroCard) and lookup (getHeroBySlug) must use the same rules;
 * otherwise aliases containing hyphens, apostrophes, or parentheses produce 404s.
 */
export function slugifyAlias(alias: string): string {
  return alias
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function compareSlug(alias: string, slug: string): boolean {
  return slugifyAlias(alias) === slug.toLowerCase()
}
