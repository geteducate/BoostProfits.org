'use client'

import { useState } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { Play, Lock } from 'lucide-react'

export default function VSL() {
  const [playing, setPlaying] = useState(false)

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border bg-[#F5F1EB]/40">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-charcoal mb-4">
            7 minutes. I&apos;ll show you the sentence that&apos;s costing you buyers.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <p className="text-[17px] text-charcoal/60 leading-relaxed mb-10 max-w-xl mx-auto">
            In the next 7 minutes I&apos;m going to show you: why 94% of good offers get ignored,
            what buyers actually read on your page, and the one shift that changes how much you
            make per hour.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.16}>
          <div className="relative rounded-2xl overflow-hidden border border-warm-border shadow-xl aspect-video mb-8 bg-navy/[0.04] group">
            {!playing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                {/* Subtle grid overlay */}
                <div className="absolute inset-0 opacity-5"
                  style={{ backgroundImage: 'linear-gradient(#0F2A47 1px, transparent 1px), linear-gradient(90deg, #0F2A47 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <button
                  onClick={() => setPlaying(true)}
                  className="relative z-10 w-20 h-20 rounded-full bg-navy text-white flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-2xl group-hover:shadow-navy/30"
                  aria-label="Play video"
                >
                  <Play size={26} fill="white" className="ml-1.5" />
                </button>

                <div className="relative z-10 flex flex-col items-center gap-1">
                  <p className="text-sm font-medium text-charcoal/60">Why Most Offers Fail — 7 min</p>
                  <div className="flex items-center gap-1.5 text-xs text-charcoal/35">
                    <Lock size={10} />
                    <span>No scrubbing. Watch fully for best results.</span>
                  </div>
                </div>
              </div>
            ) : (
              <video
                className="w-full h-full object-cover"
                controls
                controlsList="nodownload nofullscreen noremoteplayback noseek"
                autoPlay
                playsInline
                onContextMenu={(e) => e.preventDefault()}
                aria-label="BoostProfits explainer video"
              >
                {/* Replace with your actual VSL video source */}
                <source src="/video/explainer.mp4" type="video/mp4" />
              </video>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.24}>
          <a
            href="#booking"
            className="inline-flex items-center px-7 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Book Your Free Audit
          </a>
          <p className="mt-3 text-xs text-charcoal/35">Takes 2 minutes. We&apos;ll do the rest.</p>
        </AnimatedSection>
      </div>
    </section>
  )
}
