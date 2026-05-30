import AnimatedSection from '@/components/ui/AnimatedSection'
import { Check } from 'lucide-react'

const outcomes = [
  'A stranger lands on your page and gets it in three seconds flat',
  'Your DMs fill up with "how do I pay you?" instead of silence',
  'You make $200 in the time it takes to drink your coffee',
  'Selling stops feeling like begging and starts feeling like taking orders',
]

export default function FutureVision() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-navy/50 uppercase mb-5">
            Now picture the other version
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.06}>
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-charcoal mb-6">
            It&apos;s a Tuesday. You check your phone. Two people bought while you slept.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.12}>
          <p className="text-[18px] text-charcoal/65 leading-relaxed mb-12">
            Same product. Same traffic. Same you. The only thing that changed was the words.
            They land. People get it. They don&apos;t think — they buy. And you wake up to money
            that wasn&apos;t there last night. No new ads. No grind. Just words finally pulling
            their weight.
          </p>
        </AnimatedSection>

        <div className="space-y-4 mb-14">
          {outcomes.map((outcome, i) => (
            <AnimatedSection key={i} delay={0.16 + i * 0.08}>
              <div className="flex items-center gap-3.5">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center">
                  <Check size={11} className="text-navy" strokeWidth={2.5} />
                </div>
                <p className="text-[17px] text-charcoal/75">{outcome}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.5}>
          <p className="font-serif text-[20px] font-medium text-charcoal italic border-l-2 border-navy/20 pl-5">
            That&apos;s the whole gap between where you are and where you want to be. It&apos;s just words.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
