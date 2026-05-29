import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import LenisProvider from '@/components/providers/LenisProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })

export const metadata: Metadata = {
  title: 'BoostProfits — Your Words Are Costing You $200 Every Hour',
  description: 'Not your product. Not your price. The words. We fix them in 7 days.',
  openGraph: {
    title: 'BoostProfits — Your Words Are Costing You $200 Every Hour',
    description: 'We fix the copy. 7 days. You feel the difference.',
    type: 'website',
  },
  icons: { icon: '/icon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
