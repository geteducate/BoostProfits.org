'use client'

import { motion } from 'framer-motion'

// ── Floating Rocket ──────────────────────────────────────────
export function RocketEmoji({ size = 32 }: { size?: number }) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 32 32" fill="none"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      {/* Body */}
      <path d="M16 4 C16 4 22 8 22 18 L16 22 L10 18 C10 8 16 4 16 4Z" fill="#0F2A47" />
      {/* Window */}
      <circle cx="16" cy="14" r="2.5" fill="white" opacity="0.9" />
      {/* Fins */}
      <path d="M10 18 L7 23 L10 21Z" fill="#0F2A47" opacity="0.7" />
      <path d="M22 18 L25 23 L22 21Z" fill="#0F2A47" opacity="0.7" />
      {/* Flame */}
      <motion.path
        d="M13 22 Q14 26 16 28 Q18 26 19 22Z"
        fill="#F59E0B"
        animate={{ scaleY: [1, 1.3, 0.9, 1], opacity: [1, 0.8, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <motion.path
        d="M14.5 22 Q15.5 25 16 26.5 Q16.5 25 17.5 22Z"
        fill="#FCD34D"
        animate={{ scaleY: [1, 1.4, 0.8, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
      />
    </motion.svg>
  )
}

// ── Pulsing Lightning ────────────────────────────────────────
export function LightningEmoji({ size = 28 }: { size?: number }) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 28 28" fill="none"
      animate={{ scale: [1, 1.12, 1], opacity: [1, 0.85, 1] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      {/* Glow */}
      <motion.ellipse
        cx="14" cy="14" rx="10" ry="11"
        fill="#FCD34D" opacity="0.12"
        animate={{ rx: [10, 13, 10], ry: [11, 14, 11], opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      {/* Bolt */}
      <path
        d="M17 4 L10 15 H15 L11 24 L22 11 H16 L20 4Z"
        fill="#F59E0B"
        stroke="#FCD34D"
        strokeWidth="0.5"
      />
    </motion.svg>
  )
}

// ── Animated Bar Chart (Rising Profits) ──────────────────────
export function ChartEmoji({ size = 32 }: { size?: number }) {
  const bars = [
    { x: 4, h: 10, delay: 0 },
    { x: 10, h: 16, delay: 0.1 },
    { x: 16, h: 12, delay: 0.2 },
    { x: 22, h: 22, delay: 0.3 },
  ]
  return (
    <svg width={size} height={size} viewBox="0 0 30 28" fill="none" aria-hidden="true">
      {/* Axes */}
      <line x1="3" y1="3" x2="3" y2="25" stroke="#0F2A47" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <line x1="3" y1="25" x2="27" y2="25" stroke="#0F2A47" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      {/* Bars */}
      {bars.map((bar) => (
        <motion.rect
          key={bar.x}
          x={bar.x}
          y={25 - bar.h}
          width="5"
          height={bar.h}
          rx="1.5"
          fill="#0F2A47"
          initial={{ scaleY: 0, originY: 1 }}
          animate={{ scaleY: [0, 1, 0.9, 1] }}
          transition={{ duration: 1.5, delay: bar.delay, repeat: Infinity, repeatDelay: 2.5, ease: 'easeOut' }}
          style={{ transformOrigin: `${bar.x + 2.5}px 25px` }}
        />
      ))}
      {/* Arrow up */}
      <motion.path
        d="M22 7 L25 4 L28 7"
        stroke="#0F2A47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 1 }}
      />
    </svg>
  )
}

// ── Pulsing Target ───────────────────────────────────────────
export function TargetEmoji({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Outer ring */}
      <motion.circle
        cx="14" cy="14" r="11"
        stroke="#0F2A47" strokeWidth="1.8" fill="none" opacity="0.15"
        animate={{ r: [11, 13, 11], opacity: [0.15, 0.05, 0.15] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Middle ring */}
      <circle cx="14" cy="14" r="8" stroke="#0F2A47" strokeWidth="1.8" fill="none" opacity="0.35" />
      {/* Inner ring */}
      <circle cx="14" cy="14" r="5" stroke="#0F2A47" strokeWidth="1.8" fill="none" opacity="0.6" />
      {/* Bullseye */}
      <motion.circle
        cx="14" cy="14" r="2.5"
        fill="#0F2A47"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </svg>
  )
}

// ── Spinning Coin / Money ────────────────────────────────────
export function MoneyEmoji({ size = 28 }: { size?: number }) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 28 28" fill="none"
      aria-hidden="true"
    >
      <motion.g
        animate={{ scaleX: [1, 0.1, 1, 0.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, times: [0, 0.25, 0.5, 0.75, 1] }}
        style={{ transformOrigin: '14px 14px' }}
      >
        <circle cx="14" cy="14" r="11" fill="#F59E0B" />
        <circle cx="14" cy="14" r="9" fill="#FCD34D" />
        <text x="14" y="18.5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#92400E" fontFamily="serif">$</text>
      </motion.g>
    </motion.svg>
  )
}

// ── Star / Spark ──────────────────────────────────────────────
export function SparkEmoji({ size = 24 }: { size?: number }) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      animate={{ rotate: [0, 20, -10, 0], scale: [1, 1.1, 0.95, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      <path
        d="M12 2 L13.5 9 L20 8 L14.5 12.5 L17 19.5 L12 15.5 L7 19.5 L9.5 12.5 L4 8 L10.5 9 Z"
        fill="#F59E0B"
        stroke="#FCD34D"
        strokeWidth="0.5"
      />
    </motion.svg>
  )
}
