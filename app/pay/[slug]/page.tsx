import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { paymentLinks, merchants } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { CheckoutCard } from "@/components/checkout/checkout-card"
import { brand } from "@/lib/brand"
import { ShieldCheckIcon } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PayPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [row] = await db
    .select({
      id: paymentLinks.id,
      title: paymentLinks.title,
      description: paymentLinks.description,
      amount: paymentLinks.amount,
      currency: paymentLinks.currency,
      provider: paymentLinks.provider,
      addressIn: paymentLinks.addressIn,
      status: paymentLinks.status,
      businessName: merchants.businessName,
    })
    .from(paymentLinks)
    .leftJoin(merchants, eq(paymentLinks.merchantId, merchants.id))
    .where(eq(paymentLinks.slug, slug))
    .limit(1)

  if (!row || row.status !== "active" || !row.addressIn) {
    notFound()
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <CheckoutCard
          title={row.title}
          description={row.description}
          amount={row.amount}
          currency={row.currency}
          provider={row.provider}
          addressIn={row.addressIn}
          businessName={row.businessName || brand.name}
        />
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheckIcon className="size-3.5" aria-hidden="true" />
          Secured checkout powered by {brand.name}. Card details never touch this site.
        </p>
      </div>
    </main>
  )
}
