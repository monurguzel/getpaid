import { Wallet, Rocket, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: Wallet,
    stat: '0%',
    statLabel: 'Custody',
    title: 'Your funds bypass us entirely.',
    description:
      'The card processor settles USDC directly on-chain to your Polygon wallet. We never touch a cent. You keep your keys at all times.',
  },
  {
    icon: Rocket,
    stat: '0 days',
    statLabel: 'Onboarding',
    title: 'Paste a wallet. Same-day go-live.',
    description:
      'No LLC, no merchant-bank-account interview, no rolling reserve. Perfect for MVP, pre-incorporation, or soft-launch — pre-revenue solo founders welcome.',
  },
  {
    icon: EyeOff,
    stat: '0 bans',
    statLabel: 'Risk',
    title: 'Invisible to bank risk teams.',
    description:
      'Your customer\u2019s statement reads "USDC PURCHASE". No product keyword. No high-risk MCC code. Nothing for a bank risk team to flag.',
  },
]

export function Features() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 md:px-6 md:py-28">
        <div className="flex max-w-2xl flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Built different
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Non-custodial by design. Unbannable by architecture.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{feature.stat}</p>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {feature.statLabel}
                    </p>
                  </div>
                </div>
                <CardTitle className="pt-2 text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
