import { getMerchantProfile } from "@/app/actions/merchant"
import { getPaymentLinks } from "@/app/actions/links"
import { LinksManager } from "@/components/dashboard/links-manager"

export default async function LinksPage() {
  const [merchant, links] = await Promise.all([getMerchantProfile(), getPaymentLinks()])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payment links</h1>
        <p className="text-sm text-muted-foreground">
          Create hosted checkout links your customers can pay with card or Apple Pay.
        </p>
      </div>
      <LinksManager
        links={links.map((l) => ({
          id: l.id,
          slug: l.slug,
          title: l.title,
          description: l.description,
          amount: l.amount,
          currency: l.currency,
          provider: l.provider,
          status: l.status,
          createdAt: l.createdAt.toISOString(),
        }))}
        hasWallet={Boolean(merchant?.payoutWallet)}
      />
    </div>
  )
}
