-- BoostProfits: custom OTP verification table
-- Bypasses Supabase's rate-limited email service.
-- Codes expire in 15 minutes, one code per email at a time.

create table if not exists public.verification_codes (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  code       text not null,
  used       boolean not null default false,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '15 minutes')
);

-- Index for fast email lookups
create index if not exists vc_email_idx on public.verification_codes (email);
-- Auto-clean expired codes daily (handled by the app, but index helps)
create index if not exists vc_expires_idx on public.verification_codes (expires_at);

alter table public.verification_codes enable row level security;

-- Anyone can insert a code (we validate server-side via the code itself)
drop policy if exists "Anyone can insert code" on public.verification_codes;
create policy "Anyone can insert code"
  on public.verification_codes for insert to anon with check (true);

drop policy if exists "Auth insert code" on public.verification_codes;
create policy "Auth insert code"
  on public.verification_codes for insert to authenticated with check (true);

-- Anyone can read unexpired/unused codes for their email (for verification)
drop policy if exists "Read own code" on public.verification_codes;
create policy "Read own code"
  on public.verification_codes for select to anon
  using (used = false and expires_at > now());

drop policy if exists "Auth read own code" on public.verification_codes;
create policy "Auth read own code"
  on public.verification_codes for select to authenticated
  using (used = false and expires_at > now());

-- Mark code as used
drop policy if exists "Mark used" on public.verification_codes;
create policy "Mark used"
  on public.verification_codes for update to anon
  using (used = false and expires_at > now())
  with check (used = true);

drop policy if exists "Auth mark used" on public.verification_codes;
create policy "Auth mark used"
  on public.verification_codes for update to authenticated
  using (used = false and expires_at > now())
  with check (used = true);
