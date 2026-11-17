-- #443: sessions issued under a previous ADMIN_PASSWORD must stop validating
-- once the credential changes. We track an epoch plus a hash of the password
-- the current epoch belongs to.

alter table admin_sessions add column if not exists password_epoch integer not null default 0;

create index if not exists admin_sessions_password_epoch_idx on admin_sessions (password_epoch);

create table if not exists admin_password_epoch (
  id integer primary key default 1,
  epoch integer not null default 0,
  password_hash text,
  updated_at timestamptz not null default now()
);

insert into admin_password_epoch (id, epoch, password_hash)
values (1, 0, null)
on conflict (id) do nothing;
