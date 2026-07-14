import crypto from "node:crypto"
import { db } from "@/lib/db"
import { webhooks, webhookDeliveries } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"

/**
 * Dispatch an event to all enabled webhook endpoints of a merchant.
 * Each request is signed with HMAC-SHA256 over the raw body using the
 * endpoint's secret, sent in the X-Signature header.
 */
export async function dispatchWebhooks(opts: {
  merchantId: number
  event: string
  transactionId?: number
  payload: Record<string, unknown>
}) {
  const { merchantId, event, transactionId, payload } = opts

  const endpoints = await db
    .select()
    .from(webhooks)
    .where(and(eq(webhooks.merchantId, merchantId), eq(webhooks.enabled, true)))

  if (endpoints.length === 0) return

  const body = JSON.stringify({ event, data: payload, timestamp: Date.now() })

  await Promise.allSettled(
    endpoints.map(async (endpoint) => {
      const signature = crypto
        .createHmac("sha256", endpoint.secret)
        .update(body)
        .digest("hex")

      let responseStatus: number | null = null
      let success = false
      let error: string | null = null

      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 10_000)
        const res = await fetch(endpoint.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Signature": signature,
            "X-Event": event,
          },
          body,
          signal: controller.signal,
        })
        clearTimeout(timeout)
        responseStatus = res.status
        success = res.ok
        if (!res.ok) error = `HTTP ${res.status}`
      } catch (err) {
        error = err instanceof Error ? err.message : "Request failed"
      }

      await db.insert(webhookDeliveries).values({
        webhookId: endpoint.id,
        transactionId: transactionId ?? null,
        event,
        payload: { event, data: payload },
        responseStatus,
        success,
        error,
      })
    }),
  )
}
