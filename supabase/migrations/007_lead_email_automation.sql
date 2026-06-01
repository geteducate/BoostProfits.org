-- ================================================================
-- Lead email automation — fires TWO emails via Resend on every
-- new free-audit lead, fully server-side (key never in browser).
--
-- Config is stored in a PRIVATE schema table (the PostgREST API only
-- exposes the `public` schema, so these secrets are never reachable
-- from the browser). This avoids `alter database set` which is blocked
-- on hosted Supabase.
--
-- Run this ONCE in Supabase → SQL Editor.
-- Replace the Resend key placeholder below before running.
-- ================================================================

create extension if not exists pg_net with schema extensions;

-- 1. Private config table (not exposed via the API)
create schema if not exists private;
create table if not exists private.app_config (
  key   text primary key,
  value text not null
);
insert into private.app_config (key, value) values
  ('resend_api_key', 'YOUR_RESEND_API_KEY'),   -- paste your re_... key before running
  ('resend_from',    'BoostProfits <contact@boostprofits.org>'),
  ('operator_email', 'contact@boostprofits.org'),
  ('operator_name',  'Shukhrat')
on conflict (key) do update set value = excluded.value;

-- 2. Function: fires both emails for one free-audit lead
create or replace function public.send_lead_emails()
returns trigger
language plpgsql
security definer
set search_path = public, private, extensions
as $$
declare
  v_key      text; v_from text; v_op_email text; v_op_name text;
  v_page     text := coalesce(new.name, '—');   -- Door 1 stores the page URL in name
  v_email    text := new.email;
  v_domain   text;
  v_lead_html text; v_op_html text;
begin
  if new.source is distinct from 'free_audit' then return new; end if;

  select value into v_key      from private.app_config where key='resend_api_key';
  select value into v_from     from private.app_config where key='resend_from';
  select value into v_op_email from private.app_config where key='operator_email';
  select value into v_op_name  from private.app_config where key='operator_name';
  if v_key is null or v_key = '' then return new; end if;

  v_domain := regexp_replace(v_page, '^https?://(www\.)?', '');
  v_domain := split_part(v_domain, '/', 1);
  if v_domain = '' then v_domain := 'a page'; end if;

  -- Email 1: confirmation to the LEAD
  v_lead_html :=
    '<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#FAF7F1;color:#141414">' ||
    '<p style="font-size:16px;line-height:1.6;margin:0 0 14px">Hey,</p>' ||
    '<p style="font-size:16px;line-height:1.6;margin:0 0 14px">Got it. Your page is on my desk.</p>' ||
    '<p style="font-size:16px;line-height:1.6;margin:0 0 14px">In the next 24 hours you''ll get back three lines from it — what each one is quietly costing you by the hour, and what I''d write in their place. No pitch buried in there. Just the three leaks I''d patch first if it were my page.</p>' ||
    '<p style="font-size:16px;line-height:1.6;margin:0 0 14px">If nothing lands by tomorrow night your time, check spam, then hit reply and I''ll resend.</p>' ||
    '<p style="font-size:16px;line-height:1.6;margin:22px 0 0">— ' || coalesce(v_op_name,'BoostProfits') || '<br><span style="color:#5B5B5B">boostprofits.org</span></p></div>';

  perform net.http_post(
    url     := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Authorization','Bearer ' || v_key, 'Content-Type','application/json'),
    body    := jsonb_build_object('from',v_from,'to',jsonb_build_array(v_email),'reply_to',v_op_email,'subject','got your link','html',v_lead_html)
  );

  -- Email 2: alert to the OPERATOR (with quick-reply template)
  v_op_html :=
    '<div style="font-family:ui-monospace,Menlo,monospace;max-width:620px;margin:0 auto;padding:24px;color:#141414;font-size:13px;line-height:1.6">' ||
    '<p><b>Page:</b> <a href="' || v_page || '">' || v_page || '</a></p>' ||
    '<p><b>Email:</b> <a href="mailto:' || v_email || '">' || v_email || '</a></p>' ||
    '<p><b>Submitted:</b> ' || to_char(new.created_at,'YYYY-MM-DD HH24:MI') || ' UTC · ' || coalesce(new.location,'—') || '</p>' ||
    '<hr style="border:none;border-top:1px solid #E8E3DA;margin:18px 0">' ||
    '<p style="color:#5B5B5B">QUICK REPLY TEMPLATE (copy-paste, then edit):</p>' ||
    '<pre style="white-space:pre-wrap;background:#FAF7F1;padding:16px;border-radius:8px">' ||
    'Subject: 3 leaks I''d patch on ' || v_domain || E'\n\n' ||
    'Hey,' || E'\n\n' || 'Looked at ' || v_page || '. The three lines costing you the most:' || E'\n\n' ||
    '1. [hero/headline] — ~$___/hr because [reason]. I''d write: "______"' || E'\n' ||
    '2. [CTA/offer] — ~$___/hr because [reason]. I''d write: "______"' || E'\n' ||
    '3. [trust/proof] — ~$___/hr because [reason]. I''d write: "______"' || E'\n\n' ||
    'Want the whole page rewritten? The Pro tier handles it in 7 days.' || E'\n\n' || '— ' || coalesce(v_op_name,'') ||
    '</pre></div>';

  perform net.http_post(
    url     := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Authorization','Bearer ' || v_key, 'Content-Type','application/json'),
    body    := jsonb_build_object('from',v_from,'to',jsonb_build_array(v_op_email),'subject','🟢 audit lead — ' || v_domain,'html',v_op_html)
  );

  return new;
end;
$$;

-- 3. Trigger
drop trigger if exists trg_send_lead_emails on public.leads;
create trigger trg_send_lead_emails
  after insert on public.leads
  for each row execute function public.send_lead_emails();
