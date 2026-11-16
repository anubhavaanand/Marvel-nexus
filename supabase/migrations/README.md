# Database migrations

Ordered SQL migrations for the Multiverse Archive schema. Filenames use a
`NNN_description.sql` convention so they apply in lexicographic order.

## Current migrations

| File                                | Purpose                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| `001_admin_sessions.sql`            | Adds the `admin_sessions` table for revocable admin logins (#7).              |
| `002_franchise_constraint_full.sql` | Replaces the `heroes.franchise` CHECK with the canonical 11-value list (#40). |
| `003_add_actor_name.sql`            | Adds the `actor_name` column to `heroes` (#50).                               |
|                                     | `004_locked_content_rls.sql`                                                  | Excludes locked heroes from the public read policy (#116).                            |
|                                     | `005_hero_slug_index.sql`                                                     | Adds an indexed `slug` column + trigger so slug lookups are a single DB query (#144). |
| `006_hero_delete_cascade.sql`        | Re-adds `ON DELETE CASCADE` FKs for `canon_events`/`hero_movies` (#233). |

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
