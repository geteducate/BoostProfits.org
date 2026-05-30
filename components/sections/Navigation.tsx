'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/lib/useAuth'
import { ChevronDown, LogOut, User as UserIcon } from 'lucide-react'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)
  const { user, signOut } = useAuth()

  // Smart hide-on-scroll-down / show-on-scroll-up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      if (y > lastY.current && y > 140) {
        setHidden(true) // scrolling down past threshold
        setMenuOpen(false)
      } else {
        setHidden(false) // scrolling up
      }
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Process', href: '#process' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ]

  const displayName = user?.nickname || user?.name || ''

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${scrolled ? 'bg-cream/95 backdrop-blur-md border-b border-warm-border shadow-sm' : 'bg-transparent'}`}
      aria-label="Main navigation"
    >
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>

        {/* Center nav — desktop */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
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

        {/* Right side — desktop */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-warm-border bg-white hover:shadow-sm transition-all"
                aria-expanded={menuOpen}
              >
                <span className="w-7 h-7 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center uppercase">
                  {displayName.charAt(0)}
                </span>
                <span className="text-sm font-medium text-charcoal max-w-[120px] truncate">
                  {displayName}
                </span>
                <ChevronDown size={14} className="text-charcoal/40" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-warm-border rounded-xl shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-warm-border">
                    <p className="text-sm font-semibold text-charcoal truncate">{displayName}</p>
                    <p className="text-xs text-charcoal/45 truncate">{user.email}</p>
                  </div>
                  <a href="#process" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal/70 hover:bg-cream transition-colors">
                    <UserIcon size={14} /> See full process
                  </a>
                  <button
                    onClick={() => { setMenuOpen(false); signOut() }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="px-3.5 py-2 text-sm text-charcoal/60 hover:text-charcoal transition-colors font-medium">
                Sign In
              </Link>
              <Link href="/signup" className="px-4 py-2 text-sm font-medium border border-navy/20 text-navy rounded-lg hover:bg-navy/5 transition-all">
                Sign Up
              </Link>
              <a href="#booking" className="px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90 transition-all hover:shadow-sm">
                Book a Free Audit
              </a>
            </>
          )}
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
            {user ? (
              <>
                <div className="px-1 py-1">
                  <p className="text-sm font-semibold text-charcoal">{displayName}</p>
                  <p className="text-xs text-charcoal/45 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => { setMobileOpen(false); signOut() }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-500 text-sm font-medium rounded-lg"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/signup" className="inline-flex items-center justify-center px-4 py-2.5 bg-navy text-white text-sm font-medium rounded-lg" onClick={() => setMobileOpen(false)}>
                  Sign Up Free
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center px-4 py-2.5 border border-warm-border text-charcoal text-sm font-medium rounded-lg" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
                <a href="#booking" className="inline-flex items-center justify-center px-4 py-2.5 bg-navy/10 text-navy text-sm font-medium rounded-lg" onClick={() => setMobileOpen(false)}>
                  Book a Free Audit
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
