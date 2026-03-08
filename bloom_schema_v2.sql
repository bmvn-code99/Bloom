-- ============================================================
-- BLOOM — Supabase Schema v2
-- Run this in Supabase → SQL Editor → New query → Run
-- ============================================================


-- ── app_state ────────────────────────────────────────────────
-- Cloud localStorage replacement.
-- Each key matches the localStorage key used in BLOOM
-- (p1items, landItems, p2items, rcItems, etc.)
-- ─────────────────────────────────────────────────────────────
create table if not exists app_state (
  key         text primary key,
  value       jsonb not null,
  updated_by  text not null default 'system',
  updated_at  timestamptz default now()
);


-- ── item_locks ───────────────────────────────────────────────
-- Prevents two admins editing the same item simultaneously.
-- Locks auto-release after 5 minutes (enforced in app code).
-- ─────────────────────────────────────────────────────────────
create table if not exists item_locks (
  item_key    text primary key,
  locked_by   text not null,
  locked_at   timestamptz default now()
);


-- ── activity_log ─────────────────────────────────────────────
-- Every add / edit / delete by any admin.
-- Powers the weekly email grid.
-- ─────────────────────────────────────────────────────────────
create table if not exists activity_log (
  id          uuid primary key default gen_random_uuid(),
  timestamp   timestamptz default now(),
  admin_name  text not null,
  action_type text not null,   -- 'added' | 'edited' | 'deleted' | 'restored'
  section     text not null,   -- e.g. 'phase1', 'rc', 'brunos_house'
  item_name   text not null,
  old_value   jsonb,
  new_value   jsonb,
  week_key    text             -- 'YYYY-WNN' — groups entries for the weekly email
);

create index if not exists idx_activity_week  on activity_log(week_key);
create index if not exists idx_activity_admin on activity_log(admin_name, timestamp);


-- ── Row Level Security ───────────────────────────────────────
-- Only authenticated users (the 3 admins) can access anything.
-- ─────────────────────────────────────────────────────────────
alter table app_state    enable row level security;
alter table item_locks   enable row level security;
alter table activity_log enable row level security;

-- Drop existing policies if re-running
drop policy if exists "admins_full_access" on app_state;
drop policy if exists "admins_full_access" on item_locks;
drop policy if exists "admins_full_access" on activity_log;

create policy "admins_full_access" on app_state
  for all using (auth.role() = 'authenticated');

create policy "admins_full_access" on item_locks
  for all using (auth.role() = 'authenticated');

create policy "admins_full_access" on activity_log
  for all using (auth.role() = 'authenticated');


-- ============================================================
-- NEXT STEP after running this:
-- Go to Authentication → Users → Add user (manually)
-- Add all three admins with their emails + a temporary password:
--   bmvn@mail.co.uk            (Bruno)
--   nmogilda@sopris.tech       (Natalia)
--   sitiosaramandala@gmail.com (Felipe)
-- ============================================================
