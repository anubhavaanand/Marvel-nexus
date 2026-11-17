-- #777: canon_events.movie_id and hero_movies.movie_id have no index although
-- relation queries filter/join on them. Add indexes for query performance.

CREATE INDEX IF NOT EXISTS idx_canon_events_movie_id ON canon_events (movie_id);

CREATE INDEX IF NOT EXISTS idx_hero_movies_movie_id ON hero_movies (movie_id);