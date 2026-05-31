-- 004: Client-side admin reads + heatmap support
-- Lets the static site (anon key + RLS) power auth, lead capture,
-- activity tracking, and an admin dashboard — with no server.
--
-- The admin is whoever signs in with this email. Change it in ONE place
-- below if your owner account differs, and keep BP_CONFIG.ADMIN_EMAIL in sync.

-- ── Admin can READ leads from the browser ───────────────────────────
drop policy if exists "Admin can read leads" on public.leads;
create policy "Admin can read leads"
  on public.leads for select to authenticated
  using ( (auth.jwt() ->> 'email') = 'contact@boostprofits.org' );

-- A signed-in visitor can also submit the booking form
drop policy if exists "Allow auth insert leads" on public.leads;
create policy "Allow auth insert leads"
  on public.leads for insert to authenticated
  with check (true);

-- ── Admin can READ every page_event (for the heatmap) ───────────────
drop policy if exists "Admin can read events" on public.page_events;
create policy "Admin can read events"
  on public.page_events for select to authenticated
  using ( (auth.jwt() ->> 'email') = 'contact@boostprofits.org' );

-- Signed-in visitors also generate tracking events
drop policy if exists "Allow auth insert events" on public.page_events;
create policy "Allow auth insert events"
  on public.page_events for insert to authenticated
  with check (true);

-- ── Profiles: allow users to update their own row (so upsert works) ──
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- Helpful index for the heatmap aggregation
create index if not exists page_events_type_idx on public.page_events (event_type);
create index if not exists page_events_page_idx on public.page_events (page);
