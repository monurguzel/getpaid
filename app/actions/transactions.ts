'use server'

import { db } from '@/lib/db'
import { transactions, paymentLinks } from '@/lib/db/schema'
import { getUserId } from '@/lib/session'
import { desc, eq, sql } from 'drizzle-orm'

export async function getTransactions() {
  const userId = await getUserId()
  return db
    .select({
      id: transactions.id,
      linkId: transactions.linkId,
      linkTitle: paymentLinks.title,
      amountFiat: transactions.amountFiat,
      currency: transactions.currency,
      amountUsdc: transactions.amountUsdc,
      commissionUsdc: transactions.commissionUsdc,
      provider: transactions.provider,
      txidOut: transactions.txidOut,
      customerEmail: transactions.customerEmail,
      status: transactions.status,
      createdAt: transactions.createdAt,
    })
    .from(transactions)
    .leftJoin(paymentLinks, eq(transactions.linkId, paymentLinks.id))
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.createdAt))
    .limit(100)
}

export async function getDashboardStats() {
  const userId = await getUserId()

  const [stats] = await db
    .select({
      totalUsdc: sql<string>`coalesce(sum(${transactions.amountUsdc}), 0)`,
      txCount: sql<number>`count(*)::int`,
    })
    .from(transactions)
    .where(eq(transactions.userId, userId))

  const [linkStats] = await db
    .select({
      linkCount: sql<number>`count(*)::int`,
    })
    .from(paymentLinks)
    .where(eq(paymentLinks.userId, userId))

  return {
    totalUsdc: Number.parseFloat(stats?.totalUsdc ?? '0'),
    txCount: stats?.txCount ?? 0,
    linkCount: linkStats?.linkCount ?? 0,
  }
}
