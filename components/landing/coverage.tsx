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

type Availability = 'native' | 'supported' | 'na'

const regions = ['US', 'Canada', 'France', 'EU', 'NL', 'UK', 'India', 'Rest of world'] as const

const providers: { name: string; note: string; availability: Availability[] }[] = [
  {
    name: 'Stripe Link Crypto',
    note: 'USD / EUR · Apple Pay / Google Pay / card',
    availability: ['native', 'na', 'supported', 'supported', 'supported', 'na', 'na', 'na'],
  },
  {
    name: 'Crypto.com Pay',
    note: 'USD only · Visa/MC',
    availability: ['supported', 'na', 'native', 'native', 'native', 'native', 'supported', 'supported'],
  },
  {
    name: 'Topper',
    note: 'Apple Pay / Google Pay',
    availability: ['supported', 'na', 'native', 'supported', 'supported', 'native', 'na', 'supported'],
  },
  {
    name: 'MoonPay',
    note: 'Apple Pay / Google Pay · widest reach',
    availability: ['supported', 'supported', 'supported', 'supported', 'supported', 'supported', 'supported', 'supported'],
  },
  {
    name: 'Banxa',
    note: 'card + bank transfer',
    availability: ['supported', 'native', 'native', 'native', 'native', 'native', 'supported', 'supported'],
  },
  {
    name: 'Transak',
    note: 'card / Apple Pay · UPI in India',
    availability: ['supported', 'native', 'native', 'native', 'native', 'native', 'native', 'native'],
  },
  {
    name: 'Guardarian',
    note: 'SEPA · Open Banking · light KYC',
    availability: ['na', 'na', 'native', 'native', 'native', 'na', 'na', 'supported'],
  },
  {
    name: 'iDEAL',
    note: 'bank-to-bank · ~70% of NL e-commerce',
    availability: ['na', 'na', 'na', 'na', 'native', 'na', 'na', 'na'],
  },
  {
    name: 'UPI',
    note: 'India only · routed via Transak',
    availability: ['na', 'na', 'na', 'na', 'na', 'na', 'native', 'na'],
  },
  {
    name: 'Interac e-Transfer',
    note: 'Canadian bank-to-bank',
    availability: ['na', 'native', 'na', 'na', 'na', 'na', 'na', 'na'],
  },
]

function AvailabilityBadge({ value }: { value: Availability }) {
  if (value === 'native') {
    return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Native</Badge>
  }
  if (value === 'supported') {
    return <Badge variant="secondary">Supported</Badge>
  }
  return <span className="text-xs text-muted-foreground">—</span>
}

export function Coverage() {
  return (
    <section id="coverage" className="border-t border-border/60 bg-secondary/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 md:px-6 md:py-28">
        <div className="flex max-w-2xl flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Coverage</p>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Auto-routed by your customer&apos;s location.
          </h2>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            When a customer opens a checkout, we surface only the on-ramps that work where they
            live — sorted by acceptance rate. A Dutch customer sees iDEAL first, a French customer
            sees Guardarian (no KYC under &euro;700), a US customer sees Stripe Link Crypto. Same
            checkout link, different tiles. No config needed.
          </p>
        </div>

        <Card className="overflow-x-auto border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">On-ramp</TableHead>
                {regions.map((region) => (
                  <TableHead key={region} className="text-center">
                    {region}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.name}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{provider.name}</span>
                      <span className="text-xs text-muted-foreground">{provider.note}</span>
                    </div>
                  </TableCell>
                  {provider.availability.map((value, i) => (
                    <TableCell key={regions[i]} className="text-center">
                      <AvailabilityBadge value={value} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Native</Badge>
            Home market or top-conversion rail. Best acceptance rate.
          </span>
          <span className="flex items-center gap-2">
            <Badge variant="secondary">Supported</Badge>
            Works in this region.
          </span>
          <span className="flex items-center gap-2">
            <span className="font-medium">—</span>
            Not available. The checkout hides the tile automatically.
          </span>
        </div>
      </div>
    </section>
  )
}
