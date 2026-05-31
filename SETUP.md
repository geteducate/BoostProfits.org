# BoostProfits — Go-Live Setup (5 minutes)

The site is a **static** site on GitHub Pages, wired directly to **Supabase** from
the browser (no server needed). Email verification, the process unlock, lead
capture, the activity heatmap and the admin panel all run on the public **anon**
key — Row-Level Security keeps the data safe.

You only need to do **3 things** once.

---

## 1. Paste your two Supabase keys

In the Supabase dashboard: **Settings → API**. Copy the **Project URL** and the
**anon / public** key (NOT the service_role key).

Paste them into the `window.BP_CONFIG` block near the top of **both** files:

- `index.html`
- `admin.html`

```js
window.BP_CONFIG = {
  SUPABASE_URL:      'https://abcd1234.supabase.co',   // your Project URL
  SUPABASE_ANON_KEY: 'eyJhbGciOi...',                  // your anon public key
  SUPPORT_EMAIL:     'contact@boostprofits.org',
  ADMIN_EMAIL:       'contact@boostprofits.org'        // who can open /admin
};
```

> The anon key is *designed* to live in client code. Never paste the
> `service_role` key here.

---

## 2. Run the SQL migrations

In Supabase: **SQL Editor → New query**, then run each file in order:

1. `supabase/migrations/001_leads.sql`
2. `supabase/migrations/002_profiles_and_events.sql`
3. `supabase/migrations/003_profile_fields.sql`
4. `supabase/migrations/004_client_admin_and_heatmap.sql`  ← enables the admin panel + heatmap

(If 001–003 were already run, just run 004.)

If your owner email is **not** `contact@boostprofits.org`, edit the email in
`004_…sql` before running it, and match it in `BP_CONFIG.ADMIN_EMAIL`.

---

## 3. Turn on the 6-digit email code

By default Supabase emails a *link*. We want a *code* the user types in.

**Authentication → Providers → Email**
- ✅ Enable **Confirm email**

**Authentication → Email Templates → "Confirm signup"**
- Make sure the template includes the token. The simplest body:

```
Your BoostProfits verification code is: {{ .Token }}
```

That `{{ .Token }}` is the 6-digit code the signup form asks for.

**Authentication → URL Configuration**
- Set **Site URL** to `https://boostprofits.org`

### Create the admin account
The admin panel is just a normal Supabase user whose email matches
`ADMIN_EMAIL`. Easiest path: open the live site, click **Sign Up**, register with
`contact@boostprofits.org`, and verify the code. From then on, `admin.html`
(the 🛡️ Admin Panel link in the footer) will let that account in.

---

## What now works

| Feature | Where |
|---|---|
| Sign up → 6-digit email code → verified account | header **Sign Up** |
| Sign in | header **Sign In** |
| Full process steps unlock once verified | Process section |
| Booking form saves to `leads` | Urgency section |
| Per-section dwell-time heatmap + event counts | `admin.html` |
| Real leads list with name / email / source / location / time | `admin.html` |
| Contact / support email | `contact@boostprofits.org` everywhere |

Until the keys in step 1 are filled in, the site still loads normally; auth
just shows a friendly "not connected yet" message instead of erroring.
