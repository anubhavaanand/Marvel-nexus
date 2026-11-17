-- #480: list queries order by these columns; give Postgres a supporting index.
CREATE INDEX IF NOT EXISTS idx_heroes_name ON heroes (name);
CREATE INDEX IF NOT EXISTS idx_movies_release_date ON movies (release_date);
