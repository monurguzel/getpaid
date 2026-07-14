import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { brand } from '@/lib/brand'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt={`${brand.name} logo`} width={32} height={32} className="size-8" />
          <span className="text-lg font-semibold tracking-tight">{brand.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="#coverage"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Coverage
          </Link>
          <Link
            href="#compare"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Compare
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/sign-up">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
