import { CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const steps = [
  {
    number: '01',
    title: 'Picks how to pay — once',
    description:
      'On your checkout or your payment link. Up to 18 rails ranked by approval rate for their country and card BIN. Single click — no second selection later.',
  },
  {
    number: '02',
    title: 'Pays — never sees a wallet',
    description:
      'The wallet field on the on-ramp is pre-filled with YOURS, hidden from view. The customer just picks Apple Pay, card, or SEPA and clicks Buy now. Same UX as Amazon. They never paste an address, never pick a chain, never know crypto is involved.',
  },
  {
    number: '03',
    title: 'USDC lands in your wallet',
    description:
      '60 seconds later. Webhook fires, your store order flips to Processing, and an email notification hits your inbox. You keep your keys — we never touch a cent.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border/60 bg-secondary/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 md:px-6 md:py-28">
        <div className="flex max-w-2xl flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Two-step checkout — card or Apple Pay.
          </h2>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Your wallet is pre-filled in the payment link, invisible to your customer. They just
            pick how to pay, land directly on the on-ramp, and click Buy now. USDC settles to your
            wallet automatically. The moment it lands, you get an email notification and a webhook
            fires so your order auto-marks as paid.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.number} className="border-border/60">
              <CardHeader>
                <p className="text-sm font-bold text-primary">{step.number}</p>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}

          <Card className="border-primary/30 bg-card shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>Received</span>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Polygon</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-3xl font-bold tracking-tight">
                +181.73 <span className="text-sm font-semibold text-muted-foreground">USDC</span>
              </p>
              <Separator />
              <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary" aria-hidden="true" />
                  Sent straight to your wallet
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary" aria-hidden="true" />
                  Webhook fired — order → Paid
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary" aria-hidden="true" />
                  tx 0x7a3…f2e1 · 58s
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
