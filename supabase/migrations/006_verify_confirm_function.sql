-- Secure OTP verification + email confirmation in one atomic step.
-- Called from the browser as: sb.rpc('verify_and_confirm_email', {p_email, p_code})
-- Security: the 6-digit code must be valid, unused, and unexpired — only then
-- does the function touch auth.users. No admin key needed in the browser.

create or replace function public.verify_and_confirm_email(p_email text, p_code text)
returns jsonb
language plpgsql
security definer        -- runs with owner privileges (can write auth.users)
set search_path = public
as $$
declare
  v_code_id uuid;
begin
  -- 1. Find a valid, unused, unexpired code for this email
  select id into v_code_id
  from public.verification_codes
  where email      = p_email
    and code       = p_code
    and used       = false
    and expires_at > now()
  order by created_at desc
  limit 1;

  if v_code_id is null then
    return jsonb_build_object(
      'success', false,
      'error',   'Incorrect code or it has expired. Click "Resend code" to get a new one.'
    );
  end if;

  -- 2. Mark code as used so it can never be reused
  update public.verification_codes
  set    used = true
  where  id = v_code_id;

  -- 3. Confirm the email address in Supabase auth
  update auth.users
  set    email_confirmed_at = now(),
         updated_at         = now()
  where  email = p_email
    and  email_confirmed_at is null;

  return jsonb_build_object('success', true);
end;
$$;

-- Allow anonymous callers (the signup form runs as anon before login)
grant execute on function public.verify_and_confirm_email(text, text) to anon, authenticated;
