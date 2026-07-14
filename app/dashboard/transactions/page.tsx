import { getTransactions } from "@/app/actions/transactions"
import { TransactionsTable } from "@/components/dashboard/transactions-table"

export default async function TransactionsPage() {
  const transactions = await getTransactions()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Payments received across all your payment links, reported by PayGate IPN.
        </p>
      </div>
      <TransactionsTable transactions={transactions} />
    </div>
  )
}
