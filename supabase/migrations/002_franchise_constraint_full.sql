-- Ensure the heroes.franchise CHECK allows every value the application
-- and seed scripts use (single canonical list; see supabase/schema.sql).
--
-- This replaces whichever franchise constraint is currently present,
-- regardless of how it was created (inline CHECK, add-franchises.sql,
-- update-franchise-constraint.sql, or a pg_dump import).

DO $$
DECLARE
  con_name text;
BEGIN
  SELECT conname INTO con_name
    FROM pg_constraint
   WHERE conrelid = 'heroes'::regclass
     AND contype = 'c'
     AND pg_get_constraintdef(oid) ILIKE '%franchise%';

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE heroes DROP CONSTRAINT %I', con_name);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conrelid = 'heroes'::regclass
       AND conname = 'heroes_franchise_check'
  ) THEN
    ALTER TABLE heroes ADD CONSTRAINT heroes_franchise_check
    CHECK (franchise IN (
    'MCU',
    'X-Men',
    'Spider-Verse',
    'Defenders',
    'DC',
    'Anime',
    'The Boys',
    'Invincible',
    'Peacemaker',
    'Gaming',
    'Other'
));
  END IF;
END $$;
