import { redirect } from "next/navigation"
import Link from "next/link"
import { isAdmin } from "@/lib/session"
import { getAdminConfig, getAdminMerchants, getAdminStats } from "@/app/actions/admin"
import { AdminSettingsForm } from "@/components/admin/admin-settings-form"
import { AdminMerchantsTable } from "@/components/admin/admin-merchants-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { brand } from "@/lib/brand"
import { ArrowLeftIcon } from "lucide-react"

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/dashboard")
  }

  const [config, merchantRows, stats] = await Promise.all([
    getAdminConfig(),
    getAdminMerchants(),
    getAdminStats(),
  ])

  const statCards = [
    { label: "Total volume", value: `${stats.totalVolume.toFixed(2)} USDC` },
    { label: "Commission earned", value: `${stats.totalCommission.toFixed(2)} USDC` },
    { label: "Transactions", value: String(stats.txCount) },
    { label: "Merchants", value: String(stats.merchantCount) },
  ]

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-8 px-4 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{brand.name} admin</h1>
          <p className="text-sm text-muted-foreground">
            Platform-wide commission, payout wallet, and merchant management.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeftIcon data-icon="inline-start" />
            Dashboard
          </Link>
        </Button>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Platform stats">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <AdminSettingsForm
        commissionPercent={config.commissionPercent}
        commissionWallet={config.commissionWallet}
      />

      <Card>
        <CardHeader>
          <CardTitle>Merchants</CardTitle>
          <CardDescription>
            All registered merchants, their volume, and your commission from each.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminMerchantsTable
            merchants={merchantRows.map((m) => ({
              id: m.id,
              businessName: m.businessName,
              email: m.email,
              name: m.name,
              payoutWallet: m.payoutWallet,
              status: m.status,
              linkCount: m.linkCount,
              totalUsdc: m.totalUsdc,
              totalCommission: m.totalCommission,
              createdAt: m.createdAt.toISOString(),
            }))}
          />
        </CardContent>
      </Card>
    </main>
  )
}
