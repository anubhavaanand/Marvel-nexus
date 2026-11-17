-- Idempotent migration: refresh stale slugs after a re-seed that renames the
-- alias (#775). The guarded trigger (#410) only re-slugified when slug was
-- absent/empty, so a renamed alias left the stored slug stale. Re-slugify when
-- the computed slug differs from the stored one, but only on INSERT or when
-- name/alias actually changed, so application-chosen collision-safe slugs that
-- still match are preserved and the work stays cheap/idempotent. Re-running is
-- safe.
DROP TRIGGER IF EXISTS heroes_set_slug ON heroes;

-- #811: TG_OP is not available inside a trigger WHEN clause (Postgres raises
-- "column tg_op does not exist"), so the guarded trigger is split per event.
DROP TRIGGER IF EXISTS heroes_set_slug_insert ON heroes;
CREATE TRIGGER heroes_set_slug_insert
  BEFORE INSERT
  ON heroes
  FOR EACH ROW
  WHEN (
        NEW.slug IS NULL OR NEW.slug = ''
        OR public.hero_slugify(NEW.alias) IS DISTINCT FROM NEW.slug
  )
  EXECUTE FUNCTION public.heros_set_slug();

DROP TRIGGER IF EXISTS heroes_set_slug_update ON heroes;
CREATE TRIGGER heroes_set_slug_update
  BEFORE UPDATE OF alias, name
  ON heroes
  FOR EACH ROW
  WHEN (
        public.hero_slugify(NEW.alias) IS DISTINCT FROM NEW.slug
  )
  EXECUTE FUNCTION public.heros_set_slug();
