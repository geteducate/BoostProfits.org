'use client'

import { useState } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'I already run ads. Why do I need this?',
    a: "Because the click is the easy part. They land on your page, read the first line, and decide if they stay. Bad words — they leave. Every hour. Better copy doesn't get you more clicks. It turns the clicks you already have into money.",
  },
  {
    q: 'My business is different.',
    a: "Your product is different. Human attention isn't. The same thing that made someone buy the last thing they bought is the same thing we write to. The specifics change. The psychology doesn't.",
  },
  {
    q: "Can't I just write it myself?",
    a: "You can. You also cut your own hair sometimes. For when it matters — when money's on the line — you probably call someone. The hard part isn't writing. It's seeing your own blind spots. We do.",
  },
  {
    q: 'How fast does this happen?',
    a: "Audit: 48 hours. Full rewrite: 7 days. We don't do 'when it's ready.' You get a date. We hit it.",
  },
  {
    q: "What if it doesn't move the needle?",
    a: "We rewrite it again. Free. No invoices, no excuses. It either works or we keep going until it does. That's the deal.",
  },
  {
    q: 'Do I need a big audience or lots of traffic?',
    a: "No. Better words work on 100 visitors the same way they work on 100,000. You see the difference faster with more traffic, but the copy change matters at any scale.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border">
      <div className="max-w-2xl mx-auto">
        <AnimatedSection className="mb-12">
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-charcoal">
            Things people ask before they book.
          </h2>
        </AnimatedSection>

        <div className="divide-y divide-warm-border">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <div>
                <button
                  className="w-full flex items-center justify-between py-5 text-left group"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="text-[16px] font-medium text-charcoal pr-6 group-hover:text-navy transition-colors">
                    {faq.q}
                  </span>
                  <span className="flex-shrink-0 text-charcoal/35">
                    {open === i ? <Minus size={17} /> : <Plus size={17} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-[15px] text-charcoal/60 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
