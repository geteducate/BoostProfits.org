'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Process', href: '#process' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream border-b border-warm-border shadow-sm' : 'bg-transparent'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>

        {/* Center nav — desktop */}
        <div className="hidden md:flex items-center gap-7 flex-1 justify-center">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-charcoal/60 hover:text-charcoal transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right CTAs — desktop */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <Link
            href="/login"
            className="px-3.5 py-2 text-sm text-charcoal/60 hover:text-charcoal transition-colors font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium border border-navy/20 text-navy rounded-lg hover:bg-navy/5 transition-all"
          >
            Sign Up
          </Link>
          <a
            href="#booking"
            className="px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90 transition-all hover:shadow-sm"
          >
            Book a Free Audit
          </a>
        </div>

        {/* Hamburger — mobile */}
        <button
          className="md:hidden p-2 text-charcoal rounded-lg"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-cream border-b border-warm-border px-6 py-5 flex flex-col gap-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-charcoal/70 py-1 hover:text-charcoal transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="border-t border-warm-border pt-3 flex flex-col gap-2 mt-1">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-navy text-white text-sm font-medium rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Sign Up Free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2.5 border border-warm-border text-charcoal text-sm font-medium rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <a
              href="#booking"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-navy/10 text-navy text-sm font-medium rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Book a Free Audit
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
