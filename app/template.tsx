'use client'

import { motion } from 'framer-motion'

// Opacity-ONLY transition. We deliberately avoid `transform`/`filter` here:
// a non-`none` transform or filter on an ancestor turns it into the containing
// block for any `position: fixed` descendant (the navbar), which would break the
// sticky header. Opacity does not create a containing block, so the fixed navbar
// stays anchored to the viewport.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}
