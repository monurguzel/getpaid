import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { ArrowLeftRight, ExternalLink } from 'lucide-react'

interface TransactionRow {
  id: number
  linkTitle: string | null
  amountFiat: string | null
  currency: string
  amountUsdc: string | null
  provider: string | null
  txidOut: string | null
  customerEmail: string | null
  status: string
  createdAt: Date
}

export function TransactionsTable({ transactions }: { transactions: TransactionRow[] }) {
  if (transactions.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ArrowLeftRight />
          </EmptyMedia>
          <EmptyTitle>No transactions yet</EmptyTitle>
          <EmptyDescription>
            Payments made through your links will appear here in real time.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Link</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>USDC</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tx</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell className="max-w-40 truncate font-medium">
              {tx.linkTitle ?? '—'}
            </TableCell>
            <TableCell className="max-w-40 truncate text-muted-foreground">
              {tx.customerEmail ?? '—'}
            </TableCell>
            <TableCell className="font-mono">
              {tx.amountFiat ? `${tx.amountFiat} ${tx.currency}` : '—'}
            </TableCell>
            <TableCell className="font-mono">{tx.amountUsdc ?? '—'}</TableCell>
            <TableCell>
              <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'}>
                {tx.status}
              </Badge>
            </TableCell>
            <TableCell>
              {tx.txidOut ? (
                <a
                  href={`https://polygonscan.com/tx/${tx.txidOut}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                >
                  <span className="font-mono text-xs">
                    {tx.txidOut.slice(0, 6)}…{tx.txidOut.slice(-4)}
                  </span>
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              ) : (
                '—'
              )}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {new Date(tx.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
