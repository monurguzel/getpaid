import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const integrations = ['Shopify', 'WooCommerce', 'AI builders', 'Custom API']
const verticals = [
  'peptides',
  'research chemicals',
  'nutra',
  'CBD',
  'kratom',
  'adult',
  'supplements',
  'kava',
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Stripe-style angled gradient canvas */}
      <div
        aria-hidden="true"
        className="hero-gradient pointer-events-none absolute inset-x-0 top-0 h-[520px] origin-top-left -skew-y-6 opacity-[0.14] md:h-[620px]"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 pb-20 pt-16 md:grid-cols-2 md:px-6 md:pb-28 md:pt-24">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="outline" className="gap-2 border-primary/30 bg-background px-3 py-1 text-primary">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Live on Polygon — USDC settles in ~60 seconds
          </Badge>

          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Accept cards for your high-risk business today.
          </h1>

          <p className="text-pretty text-lg font-medium text-muted-foreground">
            No KYC. · No LLC. · No reserve. · Same-day go-live.
          </p>

          <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Your customers pay with Apple Pay or card. You cash out in USDC in 60 seconds.
            Stripe-grade UX for the founder Stripe just rejected — no merchant account interview,
            no rolling reserve, no chargebacks.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="rounded-full">
              <Link href="/sign-up">
                Start now
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full bg-background">
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Plug into
            </p>
            <div className="flex flex-wrap gap-2">
              {integrations.map((item) => (
                <Badge key={item} variant="secondary" className="bg-secondary font-medium">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Welcome verticals</span>
            {' · '}
            {verticals.join(' · ')}
          </p>
        </div>

        {/* Settlement mock card */}
        <div className="flex flex-col gap-4">
          <Card className="shadow-xl shadow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>Received</span>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-4xl font-bold tracking-tight">
                +181.73 <span className="text-lg font-semibold text-muted-foreground">USDC</span>
              </p>
              <Separator />
              <ul className="flex flex-col gap-3 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                  Sent straight to your wallet
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                  Email sent to you@yourshop.com
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                  Webhook fired — order marked Paid
                </li>
              </ul>
              <Separator />
              <p className="font-mono text-xs text-muted-foreground">
                tx 0x7a3…f2e1 · Polygon · 58s
              </p>
            </CardContent>
          </Card>
          <p className="text-center text-sm text-muted-foreground">
            You receive ~93–97% of the charged amount in USDC, depending on the payment rail your
            customer picks at checkout.
          </p>
        </div>
      </div>
    </section>
  )
}
