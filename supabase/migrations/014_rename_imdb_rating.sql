-- #499: the column stores TMDB's vote_average, not an IMDb score.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'movies' AND column_name = 'imdb_rating'
  ) THEN
    ALTER TABLE movies RENAME COLUMN imdb_rating TO tmdb_rating;
  END IF;
END $$;
