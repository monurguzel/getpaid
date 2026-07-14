import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { paymentLinks, transactions } from "@/lib/db/schema"
import { dispatchWebhooks } from "@/lib/webhook-dispatch"
import { and, eq } from "drizzle-orm"

/**
 * PayGate.to IPN callback.
 * PayGate appends payment details as query parameters to the callback URL we
 * registered when creating the wallet, e.g.:
 *   value_coin, coin, txid_in, txid_out, address_in, confirmations, email, price, currency
 * The URL also carries our per-link secret which we verify before recording.
 */
async function handleIpn(req: NextRequest, linkIdRaw: string) {
  const linkId = Number.parseInt(linkIdRaw, 10)
  if (!Number.isFinite(linkId)) {
    return NextResponse.json({ error: "Invalid link" }, { status: 400 })
  }

  const params = req.nextUrl.searchParams
  const secret = params.get("secret") ?? ""

  const [link] = await db
    .select()
    .from(paymentLinks)
    .where(eq(paymentLinks.id, linkId))
    .limit(1)

  if (!link || !link.ipnToken || link.ipnToken !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const valueCoin = params.get("value_coin")
  const txidIn = params.get("txid_in")
  const txidOut = params.get("txid_out")
  const email = params.get("email")
  const price = params.get("price")
  const currency = params.get("currency") ?? link.currency
  const provider = params.get("provider") ?? link.provider

  const amountUsdc = valueCoin ? Number.parseFloat(valueCoin) : null
  const amountFiat = price ? Number.parseFloat(price) : null

  // Idempotency: skip if we already recorded this payout transaction.
  if (txidOut) {
    const [existing] = await db
      .select({ id: transactions.id })
      .from(transactions)
      .where(and(eq(transactions.linkId, linkId), eq(transactions.txidOut, txidOut)))
      .limit(1)
    if (existing) {
      return NextResponse.json({ status: "ok", duplicate: true })
    }
  }

  const commissionPct = Number.parseFloat(link.commissionPercent ?? "0")
  const commissionUsdc =
    amountUsdc != null && commissionPct > 0
      ? Math.round(amountUsdc * (commissionPct / 100) * 1e6) / 1e6
      : 0

  const rawPayload: Record<string, string> = {}
  params.forEach((value, key) => {
    if (key !== "secret") rawPayload[key] = value
  })

  const [tx] = await db
    .insert(transactions)
    .values({
      userId: link.userId,
      merchantId: link.merchantId,
      linkId: link.id,
      amountFiat: amountFiat != null ? String(amountFiat) : null,
      currency,
      amountUsdc: amountUsdc != null ? String(amountUsdc) : null,
      commissionUsdc: String(commissionUsdc),
      provider,
      txidIn,
      txidOut,
      customerEmail: email,
      status: "completed",
      rawPayload,
    })
    .returning()

  // Notify the merchant's own endpoints (fire-and-forget with logging).
  await dispatchWebhooks({
    merchantId: link.merchantId,
    event: "payment.completed",
    transactionId: tx.id,
    payload: {
      transaction_id: tx.id,
      link_slug: link.slug,
      link_title: link.title,
      amount_fiat: amountFiat,
      currency,
      amount_usdc: amountUsdc,
      txid_out: txidOut,
      customer_email: email,
      provider,
    },
  })

  return NextResponse.json({ status: "ok" })
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ linkId: string }> },
) {
  const { linkId } = await params
  return handleIpn(req, linkId)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ linkId: string }> },
) {
  const { linkId } = await params
  return handleIpn(req, linkId)
}
