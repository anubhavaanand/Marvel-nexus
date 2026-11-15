// Ensure unit tests always exercise the offline/mock data path instead of
// accidentally connecting to a real Supabase project from the local shell.
delete process.env.NEXT_PUBLIC_SUPABASE_URL
delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
delete process.env.SUPABASE_SERVICE_ROLE_KEY
delete process.env.TMDB_API_KEY
