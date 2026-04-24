import type { Metadata } from 'next'
import { Footer } from '@/components/marketing/Footer'
import { Hero } from '@/components/marketing/Hero'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { Nav } from '@/components/marketing/Nav'
import { Problem } from '@/components/marketing/Problem'
import { WaitlistCTA } from '@/components/marketing/WaitlistCTA'
import { WhyDifferent } from '@/components/marketing/WhyDifferent'

export const metadata: Metadata = {
  title: 'DraftCrane — Write the book you have been putting off',
  description:
    'A writing environment for consultants and coaches. Organized chapter by chapter, with an AI partner that reads your draft, in your own Google Drive. In private alpha — request access.',
  openGraph: {
    title: 'DraftCrane — Write the book you have been putting off',
    description:
      'A writing environment for consultants and coaches. Organized chapter by chapter, with an AI partner that reads your draft, in your own Google Drive.',
    url: 'https://draftcrane.app',
    siteName: 'DraftCrane',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DraftCrane — Write the book you have been putting off',
    description:
      'A writing environment for consultants and coaches. In private alpha — request access.',
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-[var(--dc-color-surface-primary)]">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <WhyDifferent />
        <WaitlistCTA />
      </main>
      <Footer />
    </div>
  )
}
