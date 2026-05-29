'use client'

import AnimatedSection from '@/components/ui/AnimatedSection'
import { motion } from 'framer-motion'

// ── Custom animated icon components ────────────────────────────

function BrokenWordsIcon() {
  return (
    <motion.svg width="44" height="44" viewBox="0 0 44 44" fill="none"
      whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 400 }}>
      {/* Warm red pill background */}
      <rect width="44" height="44" rx="12" fill="#FEF2F2" />
      <rect width="44" height="44" rx="12" fill="url(#words-grad)" opacity="0.6" />
      <defs>
        <linearGradient id="words-grad" x1="0" y1="0" x2="44" y2="44">
          <stop stopColor="#FCA5A5" stopOpacity="0.4" />
          <stop offset="1" stopColor="#FEF2F2" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Speech bubble */}
      <path d="M10 13 Q10 10 13 10 H31 Q34 10 34 13 V25 Q34 28 31 28 H24 L20 33 L19 28 H13 Q10 28 10 25 Z"
        fill="white" stroke="#FCA5A5" strokeWidth="1.5" />

      {/* Crack / break line through middle */}
      <motion.path
        d="M17 19 L20 16 L22 20 L25 17 L27 19"
        stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
        animate={{ pathLength: [0, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
      />

      {/* Small dollar signs floating away */}
      <motion.text x="29" y="15" fontSize="7" fill="#EF4444" opacity="0.7"
        animate={{ y: [15, 9, 15], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>$</motion.text>
      <motion.text x="11" y="13" fontSize="6" fill="#EF4444" opacity="0.5"
        animate={{ y: [13, 7, 13], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, delay: 1 }}>$</motion.text>
    </motion.svg>
  )
}

function IgnoredMessageIcon() {
  return (
    <motion.svg width="44" height="44" viewBox="0 0 44 44" fill="none"
      whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 400 }}>
      <rect width="44" height="44" rx="12" fill="#FFFBEB" />
      <defs>
        <linearGradient id="msg-grad" x1="0" y1="0" x2="44" y2="44">
          <stop stopColor="#FCD34D" stopOpacity="0.35" />
          <stop offset="1" stopColor="#FFFBEB" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="12" fill="url(#msg-grad)" opacity="0.8" />

      {/* Envelope / message */}
      <rect x="9" y="14" width="26" height="18" rx="3" fill="white" stroke="#FCD34D" strokeWidth="1.5" />
      <path d="M9 17 L22 24 L35 17" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />

      {/* "Seen" double tick marks */}
      <motion.g
        animate={{ opacity: [0, 1, 1] }}
        transition={{ duration: 0.5, delay: 0.8, repeat: Infinity, repeatDelay: 3 }}>
        <path d="M13 34 L16 37 L21 31" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M17 34 L20 37 L25 31" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </motion.g>

      {/* No reply dot (red pulsing) */}
      <motion.circle cx="34" cy="12" r="4.5" fill="#EF4444"
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }} />
      <text x="32.2" y="15.5" fontSize="6" fill="white" fontWeight="bold">!</text>
    </motion.svg>
  )
}

function GhostTrafficIcon() {
  return (
    <motion.svg width="44" height="44" viewBox="0 0 44 44" fill="none"
      whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 400 }}>
      <rect width="44" height="44" rx="12" fill="#EFF6FF" />
      <defs>
        <linearGradient id="eye-grad" x1="0" y1="0" x2="44" y2="44">
          <stop stopColor="#93C5FD" stopOpacity="0.3" />
          <stop offset="1" stopColor="#EFF6FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="12" fill="url(#eye-grad)" opacity="0.9" />

      {/* Eye shape */}
      <path d="M8 22 C12 15 32 15 36 22 C32 29 12 29 8 22Z"
        fill="white" stroke="#93C5FD" strokeWidth="1.5" />

      {/* Iris */}
      <circle cx="22" cy="22" r="5" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.5" />

      {/* Pupil — blinking */}
      <motion.circle cx="22" cy="22" r="2.5" fill="#3B82F6"
        animate={{ scaleY: [1, 0.1, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1, times: [0, 0.5, 1] }} />

      {/* Cart with ghost/zero inside (no purchase) */}
      <motion.g
        animate={{ x: [0, 6, 6], opacity: [1, 1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}>
        <path d="M29 28 L31 24 L38 24 L36.5 28Z" fill="none" stroke="#93C5FD" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="31" cy="30" r="1" fill="#93C5FD" />
        <circle cx="36" cy="30" r="1" fill="#93C5FD" />
      </motion.g>
    </motion.svg>
  )
}

function FoggyOfferIcon() {
  return (
    <motion.svg width="44" height="44" viewBox="0 0 44 44" fill="none"
      whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 400 }}>
      <rect width="44" height="44" rx="12" fill="#F5F3FF" />
      <defs>
        <linearGradient id="fog-grad" x1="0" y1="0" x2="44" y2="44">
          <stop stopColor="#C4B5FD" stopOpacity="0.35" />
          <stop offset="1" stopColor="#F5F3FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="12" fill="url(#fog-grad)" opacity="0.9" />

      {/* Fog / wavy lines */}
      {[13, 18, 23].map((y, i) => (
        <motion.path key={y}
          d={`M9 ${y} Q15 ${y - 3} 22 ${y} Q29 ${y + 3} 35 ${y}`}
          stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round" fill="none"
          opacity={0.5 - i * 0.1}
          animate={{ x: [0, 3, 0, -3, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* Bold ? mark in center */}
      <motion.text x="16" y="32" fontSize="17" fontWeight="800" fill="#7C3AED" fontFamily="serif"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}>?</motion.text>
    </motion.svg>
  )
}

const painPoints = [
  {
    Icon: BrokenWordsIcon,
    label: 'Words that inform people but never make them want to buy',
  },
  {
    Icon: IgnoredMessageIcon,
    label: 'DMs and ads that get seen but not acted on',
  },
  {
    Icon: GhostTrafficIcon,
    label: 'Traffic that reads everything, remembers nothing, buys nothing',
  },
  {
    Icon: FoggyOfferIcon,
    label: 'An offer that makes sense to you but confuses everyone else',
  },
]

export default function Problem() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border bg-[#F5F1EB]/40">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-charcoal mb-6">
            You&apos;re not losing sales. You&apos;re bleeding them.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <p className="text-[18px] text-charcoal/65 leading-relaxed mb-12">
            Every visitor who found you, read your page, and left without buying — that was a
            buyer. They had money. They had the problem. Something in the words gave them a reason
            to hesitate. And hesitation online means gone. That&apos;s not a traffic problem.
            That&apos;s a words problem.
          </p>
        </AnimatedSection>

        <div className="space-y-3">
          {painPoints.map(({ Icon, label }, i) => (
            <AnimatedSection key={i} delay={0.12 + i * 0.08}>
              <div className="group flex items-center gap-4 p-4 rounded-2xl border border-warm-border bg-white/80 hover:bg-white hover:shadow-md transition-all duration-300 cursor-default">
                <div className="flex-shrink-0">
                  <Icon />
                </div>
                <p className="text-[16px] text-charcoal/75 leading-snug font-medium">{label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
