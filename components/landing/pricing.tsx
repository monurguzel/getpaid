import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const included = [
  'Unlimited payment links',
  'Hosted checkout pages',
  'Cards, Apple Pay & Google Pay',
  'Instant USDC settlement on Polygon',
  'Real-time transaction dashboard',
  'Webhook notifications',
  'No monthly fees, no setup fees',
  'No KYC, no LLC, no paperwork',
]

export function Pricing({ commissionPercent }: { commissionPercent: number }) {
  return (
    <section id="pricing" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="mb-12 flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">Pricing</p>
          <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            One flat rate. Nothing hidden.
          </h2>
        </div>

        <Card className="mx-auto max-w-lg border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-baseline gap-2">
              <span className="text-5xl font-semibold tracking-tight text-primary">
                {commissionPercent}%
              </span>
              <span className="text-lg font-normal text-muted-foreground">per transaction</span>
            </CardTitle>
            <CardDescription>
              Plus the card processor&apos;s onramp fee, paid by your customer at checkout. You
              keep the rest — settled instantly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {included.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full" asChild>
              <Link href="/sign-up">Create your free account</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
