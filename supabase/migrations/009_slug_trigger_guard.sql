-- Idempotent migration: stop heroes_set_slug from overwriting a collision-safe
-- slug supplied by the application (#410).
--
-- Previously the trigger recomputed NEW.slug from NEW.alias on every INSERT and
-- every UPDATE OF alias, discarding any slug the caller had already chosen (e.g.
-- the collision-safe slug produced by updateHeroAction). Guard the trigger so it
-- only assigns a slug when one is absent/empty, preserving uniqueness handling
-- elsewhere. Re-running this migration is safe.
DROP TRIGGER IF EXISTS heroes_set_slug ON heroes;

CREATE TRIGGER heroes_set_slug
  BEFORE INSERT OR UPDATE OF alias
  ON heroes
  FOR EACH ROW
  WHEN (NEW.slug IS NULL OR NEW.slug = '')
  EXECUTE FUNCTION public.heros_set_slug();
