'use server'

import crypto from 'node:crypto'
import { db } from '@/lib/db'
import { webhooks, webhookDeliveries } from '@/lib/db/schema'
import { getUserId, getOrCreateMerchant } from '@/lib/session'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getWebhooks() {
  const userId = await getUserId()
  return db
    .select()
    .from(webhooks)
    .where(eq(webhooks.userId, userId))
    .orderBy(desc(webhooks.createdAt))
}

export async function createWebhook(input: { url: string; description?: string }) {
  const userId = await getUserId()
  const merchant = await getOrCreateMerchant(userId)

  let parsed: URL
  try {
    parsed = new URL(input.url.trim())
  } catch {
    return { error: 'Invalid URL.' }
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { error: 'Webhook URL must be http(s).' }
  }

  const secret = `whsec_${crypto.randomBytes(24).toString('base64url')}`

  await db.insert(webhooks).values({
    userId,
    merchantId: merchant.id,
    url: parsed.toString(),
    secret,
    description: input.description?.trim().slice(0, 200) || null,
  })

  revalidatePath('/dashboard/webhooks')
  return { success: true, secret }
}

export async function toggleWebhook(id: number, enabled: boolean) {
  const userId = await getUserId()
  await db
    .update(webhooks)
    .set({ enabled })
    .where(and(eq(webhooks.id, id), eq(webhooks.userId, userId)))
  revalidatePath('/dashboard/webhooks')
}

export async function deleteWebhook(id: number) {
  const userId = await getUserId()
  await db.delete(webhooks).where(and(eq(webhooks.id, id), eq(webhooks.userId, userId)))
  revalidatePath('/dashboard/webhooks')
}

export async function getWebhookDeliveries() {
  const userId = await getUserId()
  const own = await db
    .select({ id: webhooks.id })
    .from(webhooks)
    .where(eq(webhooks.userId, userId))
  if (own.length === 0) return []
  return db
    .select()
    .from(webhookDeliveries)
    .where(
      inArray(
        webhookDeliveries.webhookId,
        own.map((w) => w.id),
      ),
    )
    .orderBy(desc(webhookDeliveries.createdAt))
    .limit(50)
}
