import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { brand } from '@/lib/brand'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center md:px-6">
        <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Stop begging processors for approval
        </h2>
        <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Create your account, paste your wallet, and share your first payment link — all in the
          next five minutes.
        </p>
        <Button size="lg" asChild>
          <Link href="/sign-up">
            Get started free
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded bg-primary text-primary-foreground">
              <Zap className="size-3" />
            </span>
            <span className="text-sm font-medium">{brand.name}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Settlement in USDC on Polygon. Not a bank. No fiat custody.
          </p>
        </div>
      </div>
    </footer>
  )
}
