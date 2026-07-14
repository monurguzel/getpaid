import { Link2, ShoppingCart, Coins } from 'lucide-react'

const steps = [
  {
    icon: Link2,
    title: 'Create a payment link',
    description:
      'Sign up, paste your Polygon wallet address, and generate a hosted checkout link in seconds. Fixed price or open amount.',
  },
  {
    icon: ShoppingCart,
    title: 'Customer pays by card',
    description:
      'Your customer opens the link and pays with a credit card, Apple Pay, or Google Pay through a compliant onramp partner.',
  },
  {
    icon: Coins,
    title: 'You receive USDC',
    description:
      'Funds arrive in your wallet as USDC on Polygon — usually within minutes. No holds, no rolling reserves, no chargebacks on your end.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="mb-12 flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            From zero to accepting cards in under five minutes
          </h2>
        </div>

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="text-lg font-medium">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
