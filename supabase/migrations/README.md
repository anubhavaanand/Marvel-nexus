# Database migrations

Ordered SQL migrations for the Multiverse Archive schema. Filenames use a
`NNN_description.sql` convention so they apply in lexicographic order.

## Current migrations

| File                                                | Purpose                                                                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `001_admin_sessions.sql`                            | Create the `admin_sessions` table used by admin login (#443).                                                |
| `002_franchise_constraint_full.sql`                 | Allowlist `heroes.franchise` values used by app and seeds (#227).                                            |
| `003_add_actor_name.sql`                            | Add `actor_name` to heroes (#255).                                                                           |
| `004_locked_content_rls.sql`                        | RLS policy exposing locked-content flag to anon reads (#301).                                                |
| `005_hero_slug_index.sql`                           | Adds an indexed `slug` column + trigger so slug lookups are a single DB query (#144).                        |
| `006_hero_delete_cascade.sql`                       | Re-adds `ON DELETE CASCADE` FKs for `canon_events`/`hero_movies` (#233).                                     |
| `007_relations_rls.sql`                             | Row-level security policies for `canon_events` & `hero_movies` (#284).                                       |
| `008_password_epoch.sql`                            | Track password epochs so sessions issued under an old `ADMIN_PASSWORD` become invalid after rotation (#443). |
| `009_slug_trigger_guard.sql`                        | Stop `heroes_set_slug` from overwriting a collision-safe slug supplied by the application (#410).            |
| `010_delete_hero_cascade.sql`                       | Delete a hero and its `canon_events`/`hero_movies` links in one transaction (#440).                          |
| `011_admin_sessions_rls.sql`                        | Row-level security on `admin_sessions` (#460).                                                               |
| `012_list_order_indexes.sql`                        | Indexes to optimize ordered list queries (#475).                                                             |
| `013_seed_runs.sql`                                 | Track seed script execution history (#480).                                                                  |
| `014_rename_imdb_rating.sql`                        | Rename `imdb_rating` to `rating` in `hero_movies` (#490).                                                    |
| `015_apostrophe_slug_parity.sql`                    | Align `hero_slugify` apostrophe handling with TS `slugifyAlias` (#444).                                      |
| `016_uuid_ossp.sql`                                 | Creates the `uuid-ossp` extension that schema.sql assumes (#814).                                            |
| `017_slug_trigger_refresh.sql`                      | Rebuild `heroes_set_slug` for existing installs so aliases keep the fixed trigger (#775).                    |
| `018_admin_sessions_pk_align.sql`                   | Align `admin_sessions` primary key with fresh schema.sql installs (#809).                                    |
| `019_canon_events_hero_movies_movie_id_indexes.sql` | Indexes on `canon_events.movie_id` and `hero_movies.movie_id` for relation query performance (#777).         |
| `020_canon_events_unique.sql`                       | Unique `(hero_id, movie_id, description)` constraint for `canon_events`, with dedupe (#597).                 |
| `021_movies_title_unique.sql`                       | Unique `movies.title` constraint; duplicate rows are merged and links re-pointed (#598).                     |
| `022_hero_movies_role_check.sql`                    | Allowlist `hero_movies.role` to `main`/`lead`/`supporting`/`cameo` (#600).                                   |
| `023_updated_at_columns.sql`                        | Adds `updated_at` + BEFORE UPDATE triggers to heroes/movies/canon_events/hero_movies (#603).                 |

## How to apply

**Supabase hosted project (recommended):** open the SQL Editor and run each
unapplied file in order. The statements are idempotent where possible
(`IF NOT EXISTS`, guarded DROPs), so re-running is safe.

**Local Supabase CLI:** `supabase db reset` applies every migration in this
directory and then loads `../seed.sql` automatically (see
`supabase/config.toml`).

## Conventions

- One logical change per migration file.
- Only additive or corrective DDL: never drop data.
- Keep constraints in sync with `supabase/schema.sql` and the app-side
  `FRANCHISE_VALUES` list in `src/lib/hero-update.ts`.
- Seed/demo content belongs in `supabase/seed.sql`, not in migrations.
