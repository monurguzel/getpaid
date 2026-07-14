import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { brand } from '@/lib/brand'

export function SiteFooter() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center md:px-6 md:py-28">
        <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight md:text-5xl">
          Stop begging processors for approval.
        </h2>
        <p className="max-w-xl text-pretty leading-relaxed text-navy-foreground/70">
          Create your account, paste your wallet, and share your first payment link — all in the
          next five minutes. No KYC, no LLC, no reserve, same-day go-live.
        </p>
        <Button size="lg" asChild className="rounded-full">
          <Link href="/sign-up">
            Start now
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>

      <div className="border-t border-navy-foreground/15">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt={`${brand.name} logo`}
              width={24}
              height={24}
              className="size-6 rounded bg-white/90 p-0.5"
            />
            <span className="text-sm font-semibold">{brand.name}</span>
          </div>
          <nav className="flex items-center gap-4" aria-label="Footer">
            <Link
              href="#pricing"
              className="text-sm text-navy-foreground/70 transition-colors hover:text-navy-foreground"
            >
              Pricing
            </Link>
            <Link
              href="#coverage"
              className="text-sm text-navy-foreground/70 transition-colors hover:text-navy-foreground"
            >
              Coverage
            </Link>
            <Link
              href="#faq"
              className="text-sm text-navy-foreground/70 transition-colors hover:text-navy-foreground"
            >
              FAQ
            </Link>
          </nav>
          <p className="text-sm text-navy-foreground/70">
            Settlement in USDC on Polygon. Not a bank. No fiat custody.
          </p>
        </div>
      </div>
    </footer>
  )
}
