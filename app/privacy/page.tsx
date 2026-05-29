import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — BoostProfits' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-charcoal/40 hover:text-charcoal transition-colors mb-8 inline-block">← Back to site</Link>

        <h1 className="font-serif text-4xl font-semibold text-charcoal mb-2">Privacy Policy</h1>
        <p className="text-sm text-charcoal/40 mb-12">Last updated: January 2026</p>

        <div className="prose prose-charcoal space-y-8 text-[16px] text-charcoal/75 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">What we collect</h2>
            <p>When you submit your name and email via our booking form or create an account, we store:</p>
            <ul className="list-disc pl-5 space-y-1 mt-3">
              <li>Your name</li>
              <li>Your email address</li>
              <li>Your approximate location (city and country, derived from your IP address at sign-up)</li>
              <li>Which page or form you submitted from</li>
              <li>Date and time of submission</li>
            </ul>
            <p className="mt-3">We also collect anonymous page-usage data (which pages are visited, time spent) to improve the site.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">How we use it</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To contact you about the audit or service you requested</li>
              <li>To improve our messaging and offer</li>
              <li>To understand who we&apos;re helping and where they come from</li>
            </ul>
            <p className="mt-3">We do not sell your data. We do not share it with third parties except the tools we use to run this site (Supabase for storage, Vercel for hosting).</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">Data storage</h2>
            <p>Your data is stored on Supabase infrastructure with encryption in transit and at rest. Access is restricted to authorized personnel only.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">Your rights</h2>
            <p>You can request deletion of your data at any time by emailing us at{' '}
              <a href="mailto:hello@boostprofits.com" className="text-navy underline">hello@boostprofits.com</a>.
              We will remove your record within 7 days.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">Cookies</h2>
            <p>We use only functional cookies required for site operation (session management). We do not use advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">Contact</h2>
            <p>Questions about this policy:{' '}
              <a href="mailto:hello@boostprofits.com" className="text-navy underline">hello@boostprofits.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
