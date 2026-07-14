import { SiteHeader } from '@/components/landing/site-header'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Industries } from '@/components/landing/industries'
import { Pricing } from '@/components/landing/pricing'
import { Faq } from '@/components/landing/faq'
import { SiteFooter } from '@/components/landing/site-footer'
import { getPlatformConfig } from '@/lib/settings'

export default async function HomePage() {
  let commissionPercent = 2.5
  try {
    const config = await getPlatformConfig()
    commissionPercent = config.commissionPercent
  } catch {
    // fall back to default if DB is unreachable
  }

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <Industries />
        <Pricing commissionPercent={commissionPercent} />
        <Faq />
      </main>
      <SiteFooter />
    </>
  )
}
