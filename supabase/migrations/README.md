# Database migrations

Ordered SQL migrations for the Multiverse Archive schema. Filenames use a
`NNN_description.sql` convention so they apply in lexicographic order.

## Current migrations

| File                                | Purpose                                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `001_admin_sessions.sql`            | Admin sessions with server-side revocation.                                                            |
| `002_franchise_constraint_full.sql` | Ensure the heroes.franchise CHECK allows every value the application expects.                          |
| `003_add_actor_name.sql`            | Add the actor_name column that src/lib/supabase.ts and the hero UI expect.                             |
| `004_locked_content_rls.sql`        | Restrict public reads so locked ("premium") heroes are never visible to users.                         |
| `005_hero_slug_index.sql`           | Adds a denormalized, indexed `slug` column to `heroes` so slug lookups are fast.                       |
| `006_hero_delete_cascade.sql`       | Ensure deleting a hero cascades to its dependent rows (#233).                                          |
| `007_relations_rls.sql`             | Scope public reads on canon_events and hero_movies to non-locked heroes.                               |
| `008_apostrophe_slug_parity.sql`    | Idempotent migration: align hero_slugify apostrophe handling with TS slugifyAlias (#444).              |
| `008_password_epoch.sql`            | #443: sessions issued under a previous ADMIN_PASSWORD must stop validating.                            |
| `009_slug_trigger_guard.sql`        | Idempotent migration: stop heroes_set_slug from overwriting a collision-safe slug.                     |
| `010_delete_hero_cascade.sql`       | #440: deleting a hero must remove canon_events and hero_movies links in the correct order.             |
| `011_admin_sessions_rls.sql`        | #413: admin_sessions stores sha256(session token). Without RLS and without policy it is fully exposed. |
| `012_list_order_indexes.sql`        | #480: list queries order by these columns; give Postgres a supporting index.                           |
| `013_seed_runs.sql`                 | #506: persist per-kind last-seeded timestamps so they survive restarts and redeploys.                  |
| `014_rename_imdb_rating.sql`        | #499: the column stores TMDB's vote_average, not an IMDb score.                                        |

> **Note:** Migrations `008_apostrophe_slug_parity.sql` and `008_password_epoch.sql` share the same numeric prefix. This is a known duplicate-numbering issue tracked separately; do not renumber files in this README.

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
