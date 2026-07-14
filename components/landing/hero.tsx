import Link from 'next/link'
import { ArrowRight, CreditCard, ShieldOff, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,oklch(0.87_0.21_155_/_0.13),transparent)]"
      />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pb-20 pt-20 text-center md:px-6 md:pb-28 md:pt-28">
        <Badge variant="outline" className="gap-2 border-primary/30 px-3 py-1 text-primary">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Live on Polygon — instant USDC settlement
        </Badge>

        <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          The payment gateway banks don&apos;t want you to have
        </h1>

        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Accept credit cards, Apple Pay, and Google Pay for your high-risk business. No KYC. No
          LLC. No merchant account approvals. Payments settle directly to your wallet in USDC on
          Polygon.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/sign-up">
              Start accepting cards
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>

        <div className="mt-6 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border/60 bg-card/50 p-4">
            <CreditCard className="size-5 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium">Cards, Apple Pay, Google Pay</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border/60 bg-card/50 p-4">
            <ShieldOff className="size-5 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium">No KYC, no LLC required</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border/60 bg-card/50 p-4">
            <Wallet className="size-5 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium">USDC straight to your wallet</p>
          </div>
        </div>
      </div>
    </section>
  )
}
