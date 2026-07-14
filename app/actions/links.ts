'use server'

import crypto from 'node:crypto'
import { db } from '@/lib/db'
import { paymentLinks } from '@/lib/db/schema'
import { getUserId, getOrCreateMerchant } from '@/lib/session'
import { createPayGateWallet, PROVIDERS } from '@/lib/paygate'
import { getPlatformConfig } from '@/lib/settings'
import { getBaseUrl } from '@/lib/base-url'
import { and, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

function generateSlug() {
  return crypto.randomBytes(6).toString('base64url')
}

function generateIpnSecret() {
  return crypto.randomBytes(24).toString('base64url')
}

export async function getPaymentLinks() {
  const userId = await getUserId()
  return db
    .select()
    .from(paymentLinks)
    .where(eq(paymentLinks.userId, userId))
    .orderBy(desc(paymentLinks.createdAt))
}

export async function createPaymentLink(input: {
  title: string
  description?: string
  amount?: number | null
  currency: string
  provider: string
}) {
  const userId = await getUserId()
  const merchant = await getOrCreateMerchant(userId)

  if (!merchant.payoutWallet) {
    return { error: 'Set your payout wallet address in Settings before creating a payment link.' }
  }

  const title = input.title.trim().slice(0, 120)
  if (!title) return { error: 'Title is required.' }

  const amount =
    input.amount != null && Number.isFinite(input.amount) && input.amount > 0
      ? Math.round(input.amount * 100) / 100
      : null

  const provider = PROVIDERS.some((p) => p.id === input.provider) ? input.provider : 'wert'
  const currency = ['USD', 'EUR', 'GBP'].includes(input.currency) ? input.currency : 'USD'

  const slug = generateSlug()
  const ipnSecret = generateIpnSecret()
  const config = await getPlatformConfig()

  // Insert the row first so we have a stable id for the callback URL.
  const [link] = await db
    .insert(paymentLinks)
    .values({
      userId,
      merchantId: merchant.id,
      slug,
      title,
      description: input.description?.trim().slice(0, 500) || null,
      amount: amount != null ? String(amount) : null,
      currency,
      provider,
      ipnToken: ipnSecret,
      commissionPercent: String(config.commissionPercent),
      status: 'pending',
    })
    .returning()

  const callbackUrl = `${getBaseUrl()}/api/ipn/${link.id}?secret=${ipnSecret}`

  try {
    const wallet = await createPayGateWallet({
      merchantWallet: merchant.payoutWallet,
      callbackUrl,
      commissionWallet: config.commissionWallet || undefined,
      commissionPercent: config.commissionPercent,
    })

    await db
      .update(paymentLinks)
      .set({
        addressIn: wallet.address_in,
        polygonAddressIn: wallet.polygon_address_in ?? null,
        callbackUrl,
        status: 'active',
        updatedAt: new Date(),
      })
      .where(and(eq(paymentLinks.id, link.id), eq(paymentLinks.userId, userId)))
  } catch (err) {
    await db
      .delete(paymentLinks)
      .where(and(eq(paymentLinks.id, link.id), eq(paymentLinks.userId, userId)))
    console.log('[v0] PayGate wallet creation failed:', err)
    return { error: 'Could not create the payment wallet with PayGate. Please try again.' }
  }

  revalidatePath('/dashboard/links')
  return { success: true, slug }
}

export async function setLinkStatus(id: number, status: 'active' | 'disabled') {
  const userId = await getUserId()
  await db
    .update(paymentLinks)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(paymentLinks.id, id), eq(paymentLinks.userId, userId)))
  revalidatePath('/dashboard/links')
}
