import { getWebhooks, getWebhookDeliveries } from "@/app/actions/webhooks"
import { WebhooksManager } from "@/components/dashboard/webhooks-manager"

export default async function WebhooksPage() {
  const [hooks, deliveries] = await Promise.all([getWebhooks(), getWebhookDeliveries()])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Webhooks</h1>
        <p className="text-sm text-muted-foreground">
          Get notified on your own server whenever a payment completes. Payloads are signed with
          HMAC-SHA256.
        </p>
      </div>
      <WebhooksManager
        webhooks={hooks.map((w) => ({
          id: w.id,
          url: w.url,
          secret: w.secret,
          enabled: w.enabled,
          description: w.description,
          createdAt: w.createdAt.toISOString(),
        }))}
        deliveries={deliveries.map((d) => ({
          id: d.id,
          webhookId: d.webhookId,
          event: d.event,
          responseStatus: d.responseStatus,
          success: d.success,
          error: d.error,
          createdAt: d.createdAt.toISOString(),
        }))}
      />
    </div>
  )
}
