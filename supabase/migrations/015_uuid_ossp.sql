-- #814: schema.sql creates uuid-ossp but no migration did, so incrementally
-- migrated databases were missing it. This extension is required for
-- uuid_generate_v4() used in DEFAULT clauses across tables.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";