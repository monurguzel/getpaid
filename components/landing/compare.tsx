import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { brand } from '@/lib/brand'

const rows = [
  {
    processor: brand.name,
    highRisk: 'Yes',
    fee: 'Flat %',
    reserve: '$0',
    payout: '60 seconds',
    goLive: 'Same-day',
    highlight: true,
  },
  {
    processor: 'Stripe',
    highRisk: 'No',
    fee: '2.9% + 30\u00A2',
    reserve: '\u2014',
    payout: '\u2014',
    goLive: '\u2014',
    highlight: false,
  },
  {
    processor: 'PayPal',
    highRisk: 'No',
    fee: '3.49% + 49\u00A2',
    reserve: '\u2014',
    payout: '\u2014',
    goLive: '\u2014',
    highlight: false,
  },
  {
    processor: 'CCBill',
    highRisk: 'With friction',
    fee: '10.8 \u2013 14.5%',
    reserve: '5 \u2013 10% \u00B7 6 mo',
    payout: 'Weekly',
    goLive: '2 \u2013 4 weeks',
    highlight: false,
  },
  {
    processor: 'Checkout.com',
    highRisk: 'Enterprise only',
    fee: 'Custom',
    reserve: 'Negotiated \u00B7 6 mo',
    payout: 'T + 2 days',
    goLive: '4 \u2013 8 weeks',
    highlight: false,
  },
  {
    processor: 'CoinPayments',
    highRisk: 'Crypto only',
    fee: '0.5%',
    reserve: 'None',
    payout: 'Instant',
    goLive: 'Instant',
    highlight: false,
  },
]

export function Compare() {
  return (
    <section id="compare" className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 md:px-6 md:py-28">
        <div className="flex max-w-2xl flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Compare processors
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Side-by-side with the alternatives.
          </h2>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Fee, rolling reserve, payout speed, go-live. No spin.
          </p>
        </div>

        <Card className="overflow-x-auto border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Processor</TableHead>
                <TableHead>High-risk</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Reserve</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Go-live</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.processor} className={row.highlight ? 'bg-primary/5' : ''}>
                  <TableCell>
                    <span className="flex items-center gap-2 font-medium">
                      {row.processor}
                      {row.highlight ? (
                        <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                          Us
                        </Badge>
                      ) : null}
                    </span>
                  </TableCell>
                  <TableCell>{row.highRisk}</TableCell>
                  <TableCell className="font-mono text-sm">{row.fee}</TableCell>
                  <TableCell>{row.reserve}</TableCell>
                  <TableCell>{row.payout}</TableCell>
                  <TableCell>{row.goLive}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Reserve = cash the processor holds back in case of chargebacks. Payout = time from
          customer payment to money in your account. Go-live = time from sign-up to first accepted
          payment.
        </p>
      </div>
    </section>
  )
}
