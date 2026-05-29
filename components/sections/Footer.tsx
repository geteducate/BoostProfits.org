import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Instagram, Twitter, Mail, ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-16 px-6 lg:px-12 border-t border-warm-border bg-cream">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-0 justify-between mb-12">
          {/* Brand */}
          <div className="max-w-xs">
            <Logo className="mb-3" />
            <p className="text-sm text-charcoal/45">Copy that earns its place on the page.</p>
          </div>

          <div className="flex flex-wrap gap-12 lg:gap-16">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.15em] text-charcoal/35 uppercase mb-4">
                Company
              </p>
              <ul className="space-y-2.5">
                {[
                  ['About', '#'],
                  ['Contact', 'mailto:hello@boostprofits.com'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-charcoal/55 hover:text-charcoal transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.15em] text-charcoal/35 uppercase mb-4">
                Legal
              </p>
              <ul className="space-y-2.5">
                {[
                  ['Privacy Policy', '/privacy'],
                  ['Terms of Service', '/terms'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-charcoal/55 hover:text-charcoal transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.15em] text-charcoal/35 uppercase mb-4">
                Social
              </p>
              <ul className="space-y-2.5">
                {[
                  { label: 'Instagram', href: '#', Icon: Instagram },
                  { label: 'X / Twitter', href: '#', Icon: Twitter },
                  { label: 'Email', href: 'mailto:hello@boostprofits.com', Icon: Mail },
                ].map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="flex items-center gap-2 text-sm text-charcoal/55 hover:text-charcoal transition-colors"
                      aria-label={label}
                    >
                      <Icon size={13} />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-warm-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-charcoal/30">© 2026 BoostProfits. All rights reserved.</p>

          {/* Visible admin button — password-protected */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-charcoal/40 hover:text-charcoal/70 transition-colors border border-charcoal/15 hover:border-charcoal/30 px-3 py-1.5 rounded-lg"
          >
            <ShieldCheck size={11} />
            Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  )
}
