'use client'

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-36 px-6 lg:px-12 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-navy/5 blur-[120px]" />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative">
        {/* Copy */}
        <div>
          <motion.p
            {...fadeUp(0)}
            className="text-[11px] font-semibold tracking-[0.18em] text-navy/50 uppercase mb-5"
          >
            If you&apos;re getting views but not sales — keep reading.
          </motion.p>

          <motion.h1
            {...fadeUp(0.08)}
            className="font-serif text-[clamp(2.6rem,5.5vw,4.75rem)] font-semibold leading-[1.03] tracking-tight text-charcoal mb-6"
          >
            Your words are costing you $200 every hour.
          </motion.h1>

          <motion.p
            {...fadeUp(0.16)}
            className="text-[18px] text-charcoal/65 leading-relaxed mb-8 max-w-[500px]"
          >
            Not your product. Not your price. The words. We&apos;ve watched great offers bleed
            money for years because the copy wasn&apos;t doing the job. We fix the words. In 7
            days, you feel the difference.
          </motion.p>

          <motion.div {...fadeUp(0.24)} className="flex flex-wrap items-center gap-4 mb-8">
            <a
              href="#booking"
              className="inline-flex items-center px-7 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              Book a Free Audit
            </a>
            <a
              href="#process"
              className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors font-medium text-sm"
            >
              See how it works
              <ArrowRight size={14} />
            </a>
          </motion.div>

          <motion.p {...fadeUp(0.32)} className="text-xs text-charcoal/35">
            For founders and operators doing $10k–$100k/month who want more of it.
          </motion.p>
        </div>

        {/* 3D browser mockup */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
          aria-hidden="true"
        >
          <TiltMockup />
        </motion.div>
      </div>
    </section>
  )
}

function TiltMockup() {
  const ref = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function onMouseLeave() { rawX.set(0); rawY.set(0) }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ perspective: '1200px' }}
      className="cursor-pointer"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="rounded-2xl border border-warm-border bg-white shadow-2xl overflow-hidden"
      >
        {/* Chrome bar */}
        <div className="bg-[#F0EDE8] border-b border-warm-border px-4 py-3 flex items-center gap-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => <div key={i} className="w-3 h-3 rounded-full bg-[#E8E3DA]" />)}
          </div>
          <div className="flex-1 bg-[#E8E3DA]/60 rounded px-3 py-1.5 text-xs text-charcoal/30">
            yoursite.com
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="rounded-lg border border-red-100 bg-red-50/40 p-4">
            <p className="text-[10px] font-semibold tracking-[0.12em] text-red-400/60 uppercase mb-2">Before</p>
            <p className="text-sm text-charcoal/40 line-through leading-relaxed">
              We help businesses scale with innovative marketing solutions tailored to your unique needs.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-px h-3 bg-warm-border" />
              <div className="w-5 h-5 rounded-full bg-navy flex items-center justify-center">
                <ArrowRight size={10} className="text-white" />
              </div>
              <div className="w-px h-3 bg-warm-border" />
            </div>
          </div>

          <div className="rounded-lg border border-navy/10 bg-navy/[0.04] p-4">
            <p className="text-[10px] font-semibold tracking-[0.12em] text-navy/50 uppercase mb-2">After</p>
            <p className="text-sm font-semibold text-charcoal leading-relaxed">
              Get more paying customers without touching your ad spend.
            </p>
          </div>

          <div className="pt-1">
            <div className="w-full bg-navy rounded-lg py-2.5 text-center text-xs text-white font-medium shadow-sm">
              Book a Free Audit →
            </div>
          </div>
        </div>

        {/* 3D depth layer */}
        <div
          style={{ transform: 'translateZ(20px)' }}
          className="absolute top-3 right-3 w-2 h-2 rounded-full bg-navy/20"
        />
      </motion.div>
    </div>
  )
}
