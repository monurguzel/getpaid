import Link from 'next/link'
import { getDashboardStats, getTransactions } from '@/app/actions/transactions'
import { getMerchantProfile } from '@/app/actions/merchant'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { TransactionsTable } from '@/components/dashboard/transactions-table'
import { Wallet, ArrowLeftRight, Link2, TriangleAlert } from 'lucide-react'

export default async function DashboardOverviewPage() {
  const [stats, transactions, merchant] = await Promise.all([
    getDashboardStats(),
    getTransactions(),
    getMerchantProfile(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Your payment activity at a glance.
        </p>
      </div>

      {!merchant.payoutWallet && (
        <Alert>
          <TriangleAlert />
          <AlertTitle>Set your payout wallet</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>
              You need a Polygon wallet address on file before you can create payment links.
            </span>
            <Button size="sm" className="w-fit" asChild>
              <Link href="/dashboard/settings">Go to settings</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Wallet className="size-4" /> Total received
            </CardDescription>
            <CardTitle className="font-mono text-3xl">
              {stats.totalUsdc.toLocaleString('en-US', { maximumFractionDigits: 2 })}{' '}
              <span className="text-base font-normal text-muted-foreground">USDC</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <ArrowLeftRight className="size-4" /> Transactions
            </CardDescription>
            <CardTitle className="font-mono text-3xl">{stats.txCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Link2 className="size-4" /> Payment links
            </CardDescription>
            <CardTitle className="font-mono text-3xl">{stats.linkCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent transactions</CardTitle>
          <CardDescription>Your latest incoming payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionsTable transactions={transactions.slice(0, 5)} />
        </CardContent>
      </Card>
    </div>
  )
}
