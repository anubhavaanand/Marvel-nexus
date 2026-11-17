-- Idempotent migration: refresh stale slugs after a re-seed that renames the
-- alias (#775). The guarded trigger (#410) only re-slugified when slug was
-- absent/empty, so a renamed alias left the stored slug stale. Re-slugify when
-- the computed slug differs from the stored one, but only on INSERT or when
-- name/alias actually changed, so application-chosen collision-safe slugs that
-- still match are preserved and the work stays cheap/idempotent. Re-running is
-- safe.
DROP TRIGGER IF EXISTS heroes_set_slug ON heroes;

CREATE TRIGGER heroes_set_slug
  BEFORE INSERT OR UPDATE OF alias, name
  ON heroes
  FOR EACH ROW
  WHEN (
        NEW.slug IS NULL OR NEW.slug = ''
        OR (
          (TG_OP = 'INSERT'
           OR OLD.alias IS DISTINCT FROM NEW.alias
           OR OLD.name IS DISTINCT FROM NEW.name)
          AND public.hero_slugify(NEW.alias) IS DISTINCT FROM NEW.slug
        )
  )
  EXECUTE FUNCTION public.heros_set_slug();
