-- #600: hero_movies.role accepted any string, so imports could store '' or
-- values the UI never renders. Backfill unknown values to 'main' (the only role
-- the application writes) and enforce an allowlist.

UPDATE hero_movies
SET role = 'main'
WHERE role IS NULL
   OR role = ''
   OR role NOT IN ('main', 'lead', 'supporting', 'cameo');

ALTER TABLE hero_movies DROP CONSTRAINT IF EXISTS hero_movies_role_check;

ALTER TABLE hero_movies
  ADD CONSTRAINT hero_movies_role_check
  CHECK (role IN ('main', 'lead', 'supporting', 'cameo'));
