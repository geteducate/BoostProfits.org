import Link from 'next/link'

export const metadata = { title: 'Terms of Service — BoostProfits' }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-charcoal/40 hover:text-charcoal transition-colors mb-8 inline-block">← Back to site</Link>

        <h1 className="font-serif text-4xl font-semibold text-charcoal mb-2">Terms of Service</h1>
        <p className="text-sm text-charcoal/40 mb-12">Last updated: January 2026</p>

        <div className="space-y-8 text-[16px] text-charcoal/75 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">The service</h2>
            <p>BoostProfits provides copywriting audits, rewrites, and conversion consulting services. By using this site or purchasing a service, you agree to these terms.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">What you get</h2>
            <p>Each plan delivers specific copy deliverables as listed at purchase. Delivery timelines (48 hours for audits, 7 days for full rewrites) are target times under normal circumstances. We will communicate any delays proactively.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">Our guarantee</h2>
            <p>If the delivered copy does not improve your conversion metrics within 30 days of implementation, we will rewrite it once at no charge. This requires that you implement the copy as delivered and provide before/after performance data.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">Your responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide accurate information about your business, audience, and offer</li>
              <li>Implement the delivered copy to allow fair testing</li>
              <li>Provide access or materials needed to complete the work</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">Intellectual property</h2>
            <p>Upon full payment, all copy created for you becomes your property. We retain the right to reference the engagement (not the copy itself) in our portfolio, with your prior consent.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">Data you provide us</h2>
            <p>By creating an account or submitting a form, you consent to us collecting your name, email, and approximate location as described in our{' '}
              <Link href="/privacy" className="text-navy underline">Privacy Policy</Link>.
              This data is used solely to provide and improve our services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">Limitation of liability</h2>
            <p>We are not liable for business results. Copy is one factor among many in conversion. We make no guarantee of specific revenue outcomes.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">Contact</h2>
            <p>Questions:{' '}
              <a href="mailto:hello@boostprofits.com" className="text-navy underline">hello@boostprofits.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
