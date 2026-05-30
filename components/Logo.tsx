'use client'

import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'sm' | 'default' | 'lg'
  className?: string
  dark?: boolean
  spin?: boolean
}

export function Logo({ size = 'default', className = '', dark = false, spin = false }: LogoProps) {
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-[19px]'
  const markSize = size === 'sm' ? 26 : size === 'lg' ? 44 : 34

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <GearLogoMark size={markSize} spin={spin} />
      <span
        className={`font-serif font-semibold tracking-tight leading-none ${textSize} ${
          dark ? 'text-white' : 'text-charcoal'
        }`}
      >
        BoostProfits
      </span>
    </div>
  )
}

// ── HD Gear Mark ──────────────────────────────────────────────
// 8-tooth precision gear with radial gradient (3D convex look),
// gloss highlight, and transparent centre hole via fill-rule evenodd.
// Gear path calculated from: Ro=44 (tip), Ri=33 (root), Rh=14 (hub),
// tooth half-angle tip ±8°, root ±11°, 8 teeth at 45° intervals.
export function GearLogoMark({ size = 34, spin = false }: { size?: number; spin?: boolean }) {
  const GEAR_PATH = `
    M43.7 17.6 L43.9 6.4 A44 44 0 0 1 56.1 6.4 L56.3 17.6
    A33 33 0 0 1 68.5 22.6 L76.5 14.9 A44 44 0 0 1 85.1 23.5 L77.4 31.6
    A33 33 0 0 1 82.4 43.7 L93.6 43.9 A44 44 0 0 1 93.6 56.1 L82.4 56.3
    A33 33 0 0 1 77.4 68.5 L85.1 76.5 A44 44 0 0 1 76.5 85.1 L68.5 77.4
    A33 33 0 0 1 56.3 82.4 L56.1 93.6 A44 44 0 0 1 43.9 93.6 L43.7 82.4
    A33 33 0 0 1 31.5 77.4 L23.5 85.1 A44 44 0 0 1 14.9 76.5 L22.6 68.5
    A33 33 0 0 1 17.6 56.3 L6.4 56.1 A44 44 0 0 1 6.4 43.9 L17.6 43.7
    A33 33 0 0 1 22.6 31.5 L14.9 23.5 A44 44 0 0 1 23.5 14.9 L31.5 22.6
    A33 33 0 0 1 43.7 17.6 Z
    M64 50 A14 14 0 1 0 36 50 A14 14 0 1 0 64 50 Z
  `

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      whileHover={{ rotate: 22, scale: 1.05 }}
      animate={spin ? { rotate: 360 } : {}}
      transition={
        spin
          ? { duration: 12, repeat: Infinity, ease: 'linear' }
          : { type: 'spring', stiffness: 240, damping: 18 }
      }
    >
      <defs>
        {/* 3D convex radial gradient — bright top-left, dark bottom-right */}
        <radialGradient
          id="bp-gear-body"
          cx="32%"
          cy="26%"
          r="74%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%"   stopColor="#FEF08A" /> {/* highlight */}
          <stop offset="18%"  stopColor="#FB923C" /> {/* warm mid */}
          <stop offset="55%"  stopColor="#F97316" /> {/* orange */}
          <stop offset="100%" stopColor="#92400E" /> {/* deep shadow */}
        </radialGradient>

        {/* Gloss sheen — top-left quarter */}
        <radialGradient
          id="bp-gear-gloss"
          cx="26%"
          cy="16%"
          r="52%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%"   stopColor="white" stopOpacity="0.38" />
          <stop offset="100%" stopColor="white" stopOpacity="0"    />
        </radialGradient>

        {/* Subtle drop-shadow filter */}
        <filter id="bp-gear-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#92400E" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* ── Main gear body + transparent hole (evenodd) ── */}
      <path
        fillRule="evenodd"
        fill="url(#bp-gear-body)"
        filter="url(#bp-gear-shadow)"
        d={GEAR_PATH}
      />

      {/* ── Gloss overlay (same shape, lighter fill) ── */}
      <path
        fillRule="evenodd"
        fill="url(#bp-gear-gloss)"
        d={GEAR_PATH}
      />

      {/* ── Fine edge rim for crisp HD look ── */}
      <path
        fillRule="evenodd"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
        d={GEAR_PATH}
      />
    </motion.svg>
  )
}
