-- Profiles table (created on signup)
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  email      text not null,
  location   text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

create policy "Service role full access"
  on public.profiles for all to service_role
  using (true);

-- Page events table (anonymous analytics)
create table if not exists public.page_events (
  id         uuid primary key default gen_random_uuid(),
  page       text not null,
  event_type text not null default 'view',
  duration_s integer,
  session_id text,
  created_at timestamptz default now()
);

alter table public.page_events enable row level security;

create policy "Allow anon insert events"
  on public.page_events for insert to anon
  with check (true);

create policy "Service role read events"
  on public.page_events for select to service_role
  using (true);

-- Add location column to leads if not exists
alter table public.leads add column if not exists location text;
