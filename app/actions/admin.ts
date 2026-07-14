'use server'

import { db } from '@/lib/db'
import { user, merchants, transactions, paymentLinks } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/session'
import { setSetting, getPlatformConfig } from '@/lib/settings'
import { isValidWalletAddress } from '@/lib/paygate'
import { desc, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getAdminConfig() {
  await requireAdmin()
  return getPlatformConfig()
}

export async function updatePlatformSettings(input: {
  commissionPercent: number
  commissionWallet: string
}) {
  await requireAdmin()

  const pct = input.commissionPercent
  if (!Number.isFinite(pct) || pct < 0 || pct >= 100) {
    return { error: 'Commission must be between 0 and 99.99.' }
  }

  const wallet = input.commissionWallet.trim()
  if (wallet && !isValidWalletAddress(wallet)) {
    return { error: 'Invalid commission wallet address (must be 0x + 40 hex characters).' }
  }
  if (pct > 0 && !wallet) {
    return { error: 'Set a commission wallet to collect a commission.' }
  }

  await setSetting('commission_percent', String(Math.round(pct * 100) / 100))
  await setSetting('commission_wallet', wallet)

  revalidatePath('/admin')
  return { success: true }
}

export async function getAdminMerchants() {
  await requireAdmin()
  return db
    .select({
      id: merchants.id,
      businessName: merchants.businessName,
      payoutWallet: merchants.payoutWallet,
      status: merchants.status,
      createdAt: merchants.createdAt,
      email: user.email,
      name: user.name,
      linkCount: sql<number>`(select count(*)::int from ${paymentLinks} where ${paymentLinks.merchantId} = ${merchants.id})`,
      totalUsdc: sql<string>`coalesce((select sum(${transactions.amountUsdc}) from ${transactions} where ${transactions.merchantId} = ${merchants.id}), 0)`,
      totalCommission: sql<string>`coalesce((select sum(${transactions.commissionUsdc}) from ${transactions} where ${transactions.merchantId} = ${merchants.id}), 0)`,
    })
    .from(merchants)
    .leftJoin(user, eq(merchants.userId, user.id))
    .orderBy(desc(merchants.createdAt))
}

export async function getAdminStats() {
  await requireAdmin()
  const [stats] = await db
    .select({
      totalVolume: sql<string>`coalesce(sum(${transactions.amountUsdc}), 0)`,
      totalCommission: sql<string>`coalesce(sum(${transactions.commissionUsdc}), 0)`,
      txCount: sql<number>`count(*)::int`,
    })
    .from(transactions)
  const [m] = await db.select({ count: sql<number>`count(*)::int` }).from(merchants)
  return {
    totalVolume: Number.parseFloat(stats?.totalVolume ?? '0'),
    totalCommission: Number.parseFloat(stats?.totalCommission ?? '0'),
    txCount: stats?.txCount ?? 0,
    merchantCount: m?.count ?? 0,
  }
}

export async function setMerchantStatus(id: number, status: 'active' | 'suspended') {
  await requireAdmin()
  await db
    .update(merchants)
    .set({ status, updatedAt: new Date() })
    .where(eq(merchants.id, id))
  revalidatePath('/admin')
}
