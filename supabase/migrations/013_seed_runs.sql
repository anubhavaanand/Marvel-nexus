-- #506: persist per-kind last-seeded timestamps so they survive restarts and
-- are shared across serverless instances.
CREATE TABLE IF NOT EXISTS seed_runs (
    key TEXT PRIMARY KEY,
    seeded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE seed_runs ENABLE ROW LEVEL SECURITY;

-- Service-role only; no anon policies by design.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'seed_runs' AND policyname = 'Service role full access') THEN
    CREATE POLICY "Service role full access" ON seed_runs FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;
