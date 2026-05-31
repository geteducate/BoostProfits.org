# BoostProfits — Go-Live Checklist

Your Supabase project is already connected (`emxjtgecafkzqyepvxcs`).
Do these 3 steps once and everything is live.

---

## Step 1 — Create the database tables (30 seconds)

1. Open **Supabase → SQL Editor → New query**
2. Paste the entire contents of `supabase/migrations/000_complete_setup.sql`
3. Click **Run** (green button)

You'll see "Success. No rows returned." — done.

---

## Step 2 — Fix the email verification code (2 minutes)

By default Supabase sends a *magic link*. You need it to send a **6-digit code** instead.

1. **Supabase → Authentication → Email Templates → Confirm signup**
2. Replace the body with:

```
Your BoostProfits verification code is:

{{ .Token }}

This code expires in 10 minutes. If you didn't sign up, ignore this email.

— The BoostProfits team
contact@boostprofits.org
```

3. **Supabase → Authentication → URL Configuration**
   - Site URL: `https://boostprofits.org`
   - Redirect URLs: `https://boostprofits.org`

4. Click **Save**

---

## Step 3 — Automated booking confirmation email (5 minutes, optional)

Sign up free at **emailjs.com** — 200 emails/month free.

### A. Create an Email Service
- EmailJS → Email Services → Add New Service
- Connect your Gmail or any email
- Note the **Service ID** (e.g. `service_abc123`)

### B. Create two Email Templates

**Template 1 — owner notification** (you get this when someone books)
- Template ID: e.g. `template_owner`
- Subject: `New BoostProfits booking from {{name}}`
- Body:
```
Name:  {{name}}
Email: {{email}}

They grabbed a seat from boostprofits.org.
Reply to: {{email}}
```

**Template 2 — visitor confirmation** (visitor gets this after booking)
- Template ID: e.g. `template_guest`
- To Email field: `{{email}}`
- Subject: `Your seat is reserved — BoostProfits`
- Body:
```
Hi {{name}},

Your seat is reserved. We'll reach out personally within 24 hours from
contact@boostprofits.org — keep an eye on your inbox.

Talk soon,
BoostProfits
```

### C. Paste the 4 values into index.html

Find `BP_CONFIG` near the top of `index.html` and fill in:

```js
EMAILJS_PUBLIC_KEY:  'your_public_key',   // Account → API Keys
EMAILJS_SERVICE_ID:  'service_abc123',
EMAILJS_OWNER_TMPL:  'template_owner',
EMAILJS_GUEST_TMPL:  'template_guest'
```

Commit and push — emails fire automatically on every booking.

---

## Create the admin account

The admin panel (`/admin.html`) accepts only `contact@boostprofits.org`.

1. Go to **boostprofits.org**
2. Click **Sign Up** in the header
3. Sign up with `contact@boostprofits.org` and any password
4. Enter the 6-digit code sent to that email
5. From then on, `/admin.html` → sign in → full dashboard with leads + heatmap

---

## What's live right now

| Feature | Status |
|---|---|
| Sign Up → 6-digit email OTP → verified account | ✅ Live |
| Sign In / Sign Out | ✅ Live |
| Process steps 02-03 unlock after login | ✅ Live |
| Booking form saves to Supabase `leads` | ✅ After Step 1 |
| Per-section dwell-time heatmap | ✅ After Step 1 |
| Admin panel — leads table | ✅ After Step 1 |
| Admin panel — heatmap bars | ✅ After Step 1 |
| Automated booking confirmation email | ✅ After Step 3 |
| contact@boostprofits.org everywhere | ✅ Live |
