import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const included = [
  'Unlimited payment links',
  'Hosted checkout pages',
  'Cards, Apple Pay & Google Pay',
  'Instant USDC settlement on Polygon',
  'Real-time transaction dashboard',
  'HMAC-signed webhook notifications',
  'No monthly fees, no setup fees',
  'No KYC, no LLC, no paperwork',
]

const rails = [
  {
    rail: 'Stripe',
    note: 'USA + EU card + Apple/Google Pay',
    tag: 'Cheapest',
    onramp: 1.5,
  },
  { rail: 'iDEAL', note: 'NL only instant bank transfer', tag: null, onramp: 1.5 },
  { rail: 'Banxa', note: 'card + bank transfer', tag: null, onramp: 1.99 },
  {
    rail: 'Guardarian',
    note: 'card · no KYC under \u20AC700',
    tag: 'No KYC',
    onramp: 3.5,
  },
  { rail: 'Unlimit', note: 'Light KYC · no ID required', tag: 'No KYC', onramp: 3.5 },
  { rail: 'Transak', note: 'card + Apple/Google Pay + SEPA', tag: null, onramp: 3.5 },
  { rail: 'Topper', note: 'card + Apple Pay', tag: null, onramp: 3.9 },
  { rail: 'SimpleSwap', note: 'card + Apple/Google Pay (via Mercuryo)', tag: null, onramp: 3.95 },
  { rail: 'MoonPay', note: 'card + Apple Pay', tag: null, onramp: 4.5 },
]

export function Pricing({ commissionPercent }: { commissionPercent: number }) {
  return (
    <section id="pricing" className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 md:px-6 md:py-28">
        <div className="flex max-w-2xl flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            High-risk pricing
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            {commissionPercent}% flat + on-ramp fees from 1.5%
          </h2>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Our commission is flat at {commissionPercent}% — always. On-ramp fees depend on the
            rail your customer picks (card, SEPA, crypto direct). Per-rail breakdown below. We
            don&apos;t add any markup — our fee is already in the number you see.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <Card className="overflow-hidden border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment rail</TableHead>
                  <TableHead className="text-right">On-ramp fee</TableHead>
                  <TableHead className="text-right">Our commission</TableHead>
                  <TableHead className="text-right">Merchant total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rails.map((r) => (
                  <TableRow key={r.rail}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 font-medium">
                          {r.rail}
                          {r.tag ? (
                            <Badge variant="secondary" className="text-xs">
                              {r.tag}
                            </Badge>
                          ) : null}
                        </span>
                        <span className="text-xs text-muted-foreground">{r.note}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {r.onramp.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {commissionPercent.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold text-primary">
                      {(r.onramp + commissionPercent).toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="border-t border-border/60 px-4 py-3">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Our {commissionPercent}% is flat per successful transaction — no reserve, no
                monthly, no setup. On-ramp fees are the rail&apos;s own cost, not ours —
                pass-through. Interac (CAD), UPI (INR), and Simplex available on request.
              </p>
            </div>
          </Card>

          <Card className="h-fit border-primary/30 shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight text-primary">
                  {commissionPercent}%
                </span>
                <span className="text-lg font-normal text-muted-foreground">flat</span>
              </CardTitle>
              <CardDescription>
                Per successful transaction. No reserve, no monthly fee, no setup fee.
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
              <Button size="lg" className="w-full rounded-full" asChild>
                <Link href="/sign-up">Create your free account</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
