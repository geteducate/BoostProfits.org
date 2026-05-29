interface LogoProps {
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function Logo({ size = 'default', className = '' }: LogoProps) {
  const textSize =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'
  const markSize = size === 'sm' ? 22 : size === 'lg' ? 36 : 28

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={markSize} />
      <span className={`font-serif font-semibold text-charcoal tracking-tight ${textSize}`}>
        BoostProfits
      </span>
    </div>
  )
}

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Navy rounded-square base */}
      <rect width="28" height="28" rx="7" fill="#0F2A47" />

      {/* Rising profit chart line */}
      <polyline
        points="5,21 9,15 13,18 21,8"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Arrow head pointing up-right */}
      <polyline
        points="17.5,8 21,8 21,11.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Subtle baseline */}
      <line
        x1="5"
        y1="22.5"
        x2="23"
        y2="22.5"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  )
}
