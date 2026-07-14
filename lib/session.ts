import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user, merchants } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

export async function getUserId(): Promise<string> {
  const sessionUser = await getSessionUser()
  if (!sessionUser) throw new Error('Unauthorized')
  return sessionUser.id
}

export async function requireAdmin(): Promise<string> {
  const userId = await getUserId()
  const rows = await db.select({ role: user.role }).from(user).where(eq(user.id, userId)).limit(1)
  if (rows[0]?.role !== 'admin') throw new Error('Forbidden')
  return userId
}

export async function isAdmin(): Promise<boolean> {
  const sessionUser = await getSessionUser()
  if (!sessionUser) return false
  const rows = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, sessionUser.id))
    .limit(1)
  return rows[0]?.role === 'admin'
}

/**
 * Get (or lazily create) the merchant profile for the current user.
 */
export async function getOrCreateMerchant(userId: string) {
  const existing = await db.select().from(merchants).where(eq(merchants.userId, userId)).limit(1)
  if (existing[0]) return existing[0]
  const inserted = await db.insert(merchants).values({ userId }).returning()
  return inserted[0]
}
