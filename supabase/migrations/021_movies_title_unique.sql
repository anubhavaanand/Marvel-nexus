-- #598: movies.title was not unique, so "Iron Man" could exist twice with
-- different ids and both would show up on the timeline.
--
-- Idempotent: re-point hero_movies at the surviving copy, delete the rest,
-- then add the unique constraint only when absent.

UPDATE hero_movies hm
SET movie_id = keep.id
FROM (
  SELECT title, min(ctid) AS keep_ctid
  FROM movies
  GROUP BY title
  HAVING count(*) > 1
) d
JOIN movies del ON del.title = d.title AND del.ctid <> d.keep_ctid
JOIN movies keep ON keep.title = d.title AND keep.ctid = d.keep_ctid
WHERE hm.movie_id = del.id;

DELETE FROM movies del
USING (
  SELECT title, min(ctid) AS keep_ctid
  FROM movies
  GROUP BY title
  HAVING count(*) > 1
) d
WHERE del.title = d.title
  AND del.ctid <> d.keep_ctid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'movies_title_key'
  ) THEN
    ALTER TABLE movies
      ADD CONSTRAINT movies_title_key UNIQUE (title);
  END IF;
END
$$;
