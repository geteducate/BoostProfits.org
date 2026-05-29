import AnimatedSection from '@/components/ui/AnimatedSection'
import { Check } from 'lucide-react'

const outcomes = [
  'Someone reads your page and thinks — this is exactly what I needed',
  'Your DMs get replies that start with "how do I get started?"',
  'You wake up to buyers. No extra ads. No cold calls.',
  'Sales feel less like convincing and more like order-taking',
]

export default function FutureVision() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-charcoal mb-6">
            Picture waking up to three new buyers. Zero new ads.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <p className="text-[18px] text-charcoal/65 leading-relaxed mb-12">
            That&apos;s what happens when the words finally do the selling. Same traffic. Same
            offer. Same price. Just the right words in the right order — and people start moving.
          </p>
        </AnimatedSection>

        <div className="space-y-4 mb-14">
          {outcomes.map((outcome, i) => (
            <AnimatedSection key={i} delay={0.12 + i * 0.08}>
              <div className="flex items-start gap-3.5">
                <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center">
                  <Check size={11} className="text-navy" strokeWidth={2.5} />
                </div>
                <p className="text-[17px] text-charcoal/75 leading-snug">{outcome}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.48}>
          <p className="font-serif text-[20px] font-medium text-charcoal italic border-l-2 border-navy/20 pl-5">
            That&apos;s not luck. That&apos;s copy doing its job.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
