'use client'

import { motion } from 'framer-motion'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right'
}

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) {
  const initial =
    direction === 'left'
      ? { opacity: 0, x: -20, y: 0, filter: 'blur(4px)', scale: 0.97 }
      : direction === 'right'
      ? { opacity: 0, x: 20, y: 0, filter: 'blur(4px)', scale: 0.97 }
      : { opacity: 0, y: 20, x: 0, filter: 'blur(4px)', scale: 0.97 }

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)', scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1],
        filter: { duration: 0.45 },
        scale: { duration: 0.5 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
