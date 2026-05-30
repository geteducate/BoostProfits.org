-- Add nickname + referral_source to profiles (idempotent)
alter table public.profiles add column if not exists nickname text;
alter table public.profiles add column if not exists referral_source text;

-- Make sure anon can insert profiles during signup (pre-confirmation)
-- Without this, profile rows only land once a session exists.
drop policy if exists "Allow anon insert profile" on public.profiles;
create policy "Allow anon insert profile"
  on public.profiles for insert to anon
  with check (true);
