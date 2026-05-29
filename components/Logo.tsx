interface LogoProps {
  size?: 'sm' | 'default' | 'lg'
  className?: string
  dark?: boolean
}

export function Logo({ size = 'default', className = '', dark = false }: LogoProps) {
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-[19px]'
  const markSize = size === 'sm' ? 24 : size === 'lg' ? 40 : 32

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={markSize} dark={dark} />
      <span className={`font-serif font-semibold tracking-tight leading-none ${textSize} ${dark ? 'text-white' : 'text-charcoal'}`}>
        BoostProfits
      </span>
    </div>
  )
}

export function LogoMark({ size = 32, dark = false }: { size?: number; dark?: boolean }) {
  const bg = dark ? '#1a3a5c' : '#0F2A47'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bp-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={bg} />
          <stop offset="100%" stopColor="#0A1D30" />
        </linearGradient>
        <linearGradient id="bp-shine" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.12" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background with gradient + gloss */}
      <rect width="32" height="32" rx="8" fill="url(#bp-bg)" />
      <rect width="32" height="32" rx="8" fill="url(#bp-shine)" />

      {/* ── The mark: I-beam cursor × upward arrow ── */}
      {/* The I-beam = copywriting (text cursor) */}
      {/* The upward arrow tip = Boost / Profits */}

      {/* Bottom serif */}
      <line x1="10" y1="25" x2="22" y2="25" stroke="white" strokeWidth="2.3" strokeLinecap="round" />

      {/* Vertical beam */}
      <line x1="16" y1="25" x2="16" y2="9" stroke="white" strokeWidth="2.3" strokeLinecap="round" />

      {/* Arrow head at top (upward) */}
      <path
        d="M11 14 L16 8 L21 14"
        stroke="white"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Side copy lines — represent written words */}
      <line x1="6" y1="17" x2="11" y2="17" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.32" />
      <line x1="21" y1="17" x2="26" y2="17" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.32" />
      <line x1="6" y1="21" x2="11" y2="21" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.18" />
      <line x1="21" y1="21" x2="26" y2="21" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.18" />
    </svg>
  )
}
