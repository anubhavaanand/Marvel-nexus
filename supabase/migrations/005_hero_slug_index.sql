-- Adds a denormalized, indexed `slug` column to `heroes` so slug lookups
-- resolve in a single indexed query instead of fetching every id/alias row
-- and matching in memory (#144).
--
-- The column is kept in sync with `alias` by a trigger: new rows get a slug on
-- insert and any update to `alias` recomputes it. The slug rule is the same
-- `slugifyAlias` rule used by HeroCard and the sitemap, so links and lookups
-- can never drift apart. Backfill is idempotent and safe to re-run.

-- ---------------------------------------------------------------------------
-- Trigger helpers + trigger (defined first so the backfill can use them)
-- ---------------------------------------------------------------------------

-- Mirror of src/lib/slugs.ts::slugifyAlias. Kept in SQL so the database and
-- the application can never disagree about what a slug is.
CREATE OR REPLACE FUNCTION public.hero_slugify(alias text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    regexp_replace(
      regexp_replace(
        regexp_replace(lower(trim(coalesce(alias, ''))), '[''’]', '', 'g'),
        '[^a-z0-9]+', '-', 'g'
      ),
      '^-+|-+$', '', 'g'
    );
$$;

ALTER TABLE heroes
  ADD COLUMN IF NOT EXISTS slug text;

-- Backfill existing rows. Idempotent: only rows with a NULL slug are touched,
-- so re-running never overwrites a manually-set value.
UPDATE heroes
   SET slug = public.hero_slugify(alias)
 WHERE slug IS NULL;

-- One index per issue #144: the single lookup that replaces the full-table scan.
CREATE INDEX IF NOT EXISTS idx_heroes_slug ON heroes (slug);

CREATE OR REPLACE FUNCTION public.heros_set_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.slug := public.hero_slugify(NEW.alias);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS heroes_set_slug ON heroes;
CREATE TRIGGER heroes_set_slug
  BEFORE INSERT OR UPDATE OF alias
  ON heroes
  FOR EACH ROW
  EXECUTE FUNCTION public.heros_set_slug();