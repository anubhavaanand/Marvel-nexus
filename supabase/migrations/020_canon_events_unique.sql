-- #597: canon_events had no uniqueness constraint, so scripts/imports could
-- insert the same (hero, movie, description) event repeatedly.
--
-- Idempotent: duplicates are collapsed first, then the unique index is created
-- only when it does not already exist.

-- Collapse pre-existing duplicates, keeping the earliest physical row.
DELETE FROM canon_events a
USING canon_events b
WHERE a.hero_id = b.hero_id
  AND a.movie_id IS NOT DISTINCT FROM b.movie_id
  AND a.description IS NOT DISTINCT FROM b.description
  AND a.ctid > b.ctid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'canon_events_hero_movie_description_key'
  ) THEN
    ALTER TABLE canon_events
      ADD CONSTRAINT canon_events_hero_movie_description_key
      UNIQUE (hero_id, movie_id, description);
  END IF;
END
$$;
