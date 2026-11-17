-- Idempotent migration: align hero_slugify apostrophe handling with TS slugifyAlias (#444)
CREATE OR REPLACE FUNCTION public.hero_slugify(alias text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    regexp_replace(
      regexp_replace(
        regexp_replace(lower(trim(coalesce(alias, ''))), '[''’]', '', 'g'),
        '[^a-z0-9]+', '-', 'g'
      ),
      '^-+|-+$', '', 'g'
    );
$$;
