import { getMerchantProfile } from "@/app/actions/merchant"
import { SettingsForm } from "@/components/dashboard/settings-form"

export default async function SettingsPage() {
  const merchant = await getMerchantProfile()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Your business profile and payout wallet. Payouts arrive as USDC on Polygon.
        </p>
      </div>
      <SettingsForm
        businessName={merchant.businessName}
        payoutWallet={merchant.payoutWallet}
      />
    </div>
  )
}
