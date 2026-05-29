import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BoostProfits — Your Words Are Costing You $200 Every Hour',
  description:
    'Not your product. Not your price. The words. We fix them in 7 days. For founders doing $10k–$100k/month who want more of it.',
  openGraph: {
    title: 'BoostProfits — Your Words Are Costing You $200 Every Hour',
    description: 'We fix the copy. 7 days. You feel the difference.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans page-enter">{children}</body>
    </html>
  )
}
