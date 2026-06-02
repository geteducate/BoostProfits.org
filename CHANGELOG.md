# Changelog

## Editorial design polish (v2.1)

Visual/motion/a11y pass on top of the premium structure — no sections removed.

- **Fonts** → Fraunces (display) + General Sans (body, via Fontshare) + JetBrains Mono (before/after cards). Replaces Inter as primary. *(Editorial New / Neue Montreal need licensed WOFF2 self-hosting — used the prompt's stated Fontshare fallback.)*
- **Palette** → warmer editorial system: bg `#F6F1E8`, warm near-black ink `#1A1714`, muted/faint tiers, and a single confident **sienna accent `#C2410C`** replacing the navy/blue. Remapped onto existing CSS variables so the whole cascade shifted at once.
- **Hero** → left-aligned, Editorial-scale H1 (`clamp(40px,7vw,84px)`, weight 400), italic emphasis on **"$200 every hour"** (the only italic on the page). Primary CTA is the solid accent pill.
- **Signature scroll moment** → the hero "$200" counts up 0→200 over 800ms on first view (IntersectionObserver + rAF). Respects `prefers-reduced-motion` (shows 200 instantly).
- **Proof cards** → before/after copy now in mono; BEFORE label `--warn`, AFTER label `--success`.
- **Buttons** → pill-shaped, accent fill, 1px hover lift, cursor-follow shine, transitions inside 120–280ms.
- **Sticky nav** → fades to opaque bg + 1px bottom rule after scroll.
- **Accessibility** → skip-to-content link, `<main>` landmark, universal 2px accent focus ring, global `prefers-reduced-motion` kill-switch, canonical tag.
- **Spacing** → sections `clamp(96px,12vw,160px)`, container 1180px, body copy capped at 64ch.
- Removed dead countdown JS (the seat-cap/countdown section was already gone in v2.0).

### Build-only items NOT done (need tooling a static GitHub Pages repo lacks — flagged honestly)
- Self-hosted WOFF2 binaries + critical-CSS inlining (using Fontshare/Google CDN with `display:swap` instead)
- AVIF/WebP image pipeline (no raster images on the page — all SVG/CSS, so moot)
- Dynamic `/og-image` route (static host can't render one; would need a prebuilt 1200×630 PNG)
- Real Lighthouse before/after numbers (can't run a headless audit from here — page is light: 2 font requests, ~1 JS lib, no images)
- Lenis smooth-scroll (skipped — page isn't jumpy; native scroll is smoother on mobile)

---

## Premium repositioning (v2.0)

Repositioned the site for one-time premium engagements instead of subscription impulse buys.

### Removed
- **All consumer auth** — Sign In / Sign Up nav buttons, the signup/verification/login modal, and every auth JS function (`doSignup`, `doVerify`, `doLogin`, `resendCode`, `bpSignOut`, `applyAuthState`, `unlockProcess`, etc.). No account creation on the homepage.
- **Footer "🛡️ Admin Panel" link.** Admin now lives only at `/admin.html`, which carries `<meta name="robots" content="noindex, nofollow">` and is disallowed in `robots.txt`.
- **Process step locks** — the 🔒 blur/"Unlock with sign-up" gates on steps 02 and 03. All four steps are now fully visible.
- **Old subscription pricing** — the `$19/mo` Starter tier and all `/mo` suffixes / "Save $20" fake discounts.

### Added
- **Standalone pricing block** (`#pricing`): Audit $69 · Rewrite $149 (most-popular) · Partner from $499 then $399/mo. One-time framing: "One-time projects. Real deliverables. No subscriptions."
- **Risk-reversal section** (`#guarantee`): "If it doesn't move the needle, you don't pay the second half." — 50% upfront, 14-day measurement.
- **About-the-operator section** (`#about`) before the footer — photo placeholder, name, role, ~80-word bio, social links.
- **Expandable case study** below the proof cards (`#caseStudy`) — client/industry, result badge, "Read the teardown" toggle, screenshot + live-URL placeholders.
- **JSON-LD** structured data: Organization, Service (three tiers + prices), FAQPage.

### Changed
- **Door 3** of the booking picker no longer shows prices — it routes to the new `#pricing` block (single source of price truth).
- **Doors / nav** — "Pricing" nav link points to `#pricing`; nav CTA simplified to "Start here".
- **`<title>` + `og:title`** unified to "BoostProfits — Copy that turns attention into paying customers"; meta description rewritten for the new positioning.
- **Terms of Service** §4/§5/§6 rewritten to match new tier names, prices, and the 50%-upfront / 14-day risk model.
- **Lead alert email** quick-reply template references the Rewrite tier ($149) instead of "Pro".
- **Icons** — replaced remaining ✓ unicode (win-list) with inline navy SVG checks. No 🔒 / 🛡️ anywhere.

### Placeholders to fill in
| Placeholder (search index.html) | What |
|---|---|
| `AUDIT_LINK` | Stripe/Lemon checkout — Audit $69 |
| `REWRITE_LINK` | Stripe/Lemon checkout — Rewrite $149 |
| About: `/img/operator.jpg`, name, bio, LinkedIn/X links | Real operator details |
| Case study: client, result, 3 paragraphs, `/img/case-coastal-before-after.png`, live URL | Real published case study |
| VSL: video embed in the play-button slot | 5-min teardown recording |

Already wired from earlier work: Cal.com (`shukhrate/copy-teardown`), Resend lead emails (Supabase trigger), Supabase leads + heatmap.
