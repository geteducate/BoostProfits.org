-- ================================================================
-- BoostProfits — Complete Database Setup (run once in SQL Editor)
-- Supabase → SQL Editor → New query → paste all → Run
-- ================================================================

-- ── 1. LEADS ────────────────────────────────────────────────────
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  source      text default 'booking_cta',
  location    text,
  created_at  timestamptz default now()
);
create index if not exists leads_email_idx on public.leads (email);
alter table public.leads enable row level security;

-- Anyone (logged in or not) can submit the booking form
drop policy if exists "Allow anon insert leads" on public.leads;
create policy "Allow anon insert leads"
  on public.leads for insert to anon with check (true);

drop policy if exists "Allow auth insert leads" on public.leads;
create policy "Allow auth insert leads"
  on public.leads for insert to authenticated with check (true);

-- Only the admin account can read leads
drop policy if exists "Admin can read leads" on public.leads;
create policy "Admin can read leads"
  on public.leads for select to authenticated
  using ( (auth.jwt() ->> 'email') = 'contact@boostprofits.org' );

-- ── 2. PROFILES ─────────────────────────────────────────────────
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  name            text,
  email           text not null,
  nickname        text,
  referral_source text,
  location        text,
  created_at      timestamptz default now()
);
alter table public.profiles enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- Allow upsert right after email verification (session exists at that point)
drop policy if exists "Anon insert profile" on public.profiles;
create policy "Anon insert profile"
  on public.profiles for insert to anon with check (true);

drop policy if exists "Service role profiles" on public.profiles;
create policy "Service role profiles"
  on public.profiles for all to service_role using (true);

-- ── 3. PAGE EVENTS (heatmap + activity tracking) ────────────────
create table if not exists public.page_events (
  id         uuid primary key default gen_random_uuid(),
  page       text not null,
  event_type text not null default 'view',
  duration_s integer,
  session_id text,
  created_at timestamptz default now()
);
alter table public.page_events enable row level security;

-- Visitors (logged-in or not) can write events
drop policy if exists "Anon insert events" on public.page_events;
create policy "Anon insert events"
  on public.page_events for insert to anon with check (true);

drop policy if exists "Auth insert events" on public.page_events;
create policy "Auth insert events"
  on public.page_events for insert to authenticated with check (true);

-- Only admin reads the heatmap data
drop policy if exists "Admin read events" on public.page_events;
create policy "Admin read events"
  on public.page_events for select to authenticated
  using ( (auth.jwt() ->> 'email') = 'contact@boostprofits.org' );

create index if not exists page_events_type_idx on public.page_events (event_type);
create index if not exists page_events_page_idx on public.page_events (page);
create index if not exists page_events_session_idx on public.page_events (session_id);

-- ── Done. All three tables are ready. ───────────────────────────
