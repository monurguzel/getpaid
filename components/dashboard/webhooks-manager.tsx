"use client"

import { useState, useTransition } from "react"
import { createWebhook, deleteWebhook, toggleWebhook } from "@/app/actions/webhooks"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircleIcon,
  CheckIcon,
  CopyIcon,
  PlusIcon,
  Trash2Icon,
  WebhookIcon,
} from "lucide-react"

interface WebhookRow {
  id: number
  url: string
  secret: string
  enabled: boolean
  description: string | null
  createdAt: string
}

interface DeliveryRow {
  id: number
  webhookId: number
  event: string
  responseStatus: number | null
  success: boolean
  error: string | null
  createdAt: string
}

export function WebhooksManager({
  webhooks,
  deliveries,
}: {
  webhooks: WebhookRow[]
  deliveries: DeliveryRow[]
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createWebhook({
        url: String(form.get("url") ?? ""),
        description: String(form.get("description") ?? ""),
      })
      if (result?.error) {
        setError(result.error)
      } else {
        setOpen(false)
      }
    })
  }

  function copySecret(hook: WebhookRow) {
    navigator.clipboard.writeText(hook.secret)
    setCopiedId(hook.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <Tabs defaultValue="endpoints">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
        </TabsList>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon data-icon="inline-start" />
              Add endpoint
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add webhook endpoint</DialogTitle>
              <DialogDescription>
                We&apos;ll POST a JSON payload to this URL when a payment completes.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="url">Endpoint URL</FieldLabel>
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    placeholder="https://yourstore.com/api/payments/webhook"
                    required
                  />
                  <FieldDescription>
                    Requests include an X-Signature header (HMAC-SHA256 of the body).
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="wh-description">Description (optional)</FieldLabel>
                  <Input id="wh-description" name="description" placeholder="Production store" maxLength={200} />
                </Field>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>Could not add endpoint</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </FieldGroup>
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={isPending}>
                  {isPending && <Spinner data-icon="inline-start" />}
                  {isPending ? "Adding..." : "Add endpoint"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <TabsContent value="endpoints" className="mt-4">
        {webhooks.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <WebhookIcon />
              </EmptyMedia>
              <EmptyTitle>No webhook endpoints</EmptyTitle>
              <EmptyDescription>
                Add an endpoint to receive payment notifications on your server.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-4">
            {webhooks.map((hook) => (
              <Card key={hook.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <CardTitle className="truncate font-mono text-sm">{hook.url}</CardTitle>
                      {hook.description && (
                        <CardDescription>{hook.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={hook.enabled}
                        onCheckedChange={(checked) => toggleWebhook(hook.id, checked)}
                        aria-label="Toggle webhook"
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deleteWebhook(hook.id)}
                        aria-label="Delete webhook"
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                      {hook.secret.slice(0, 14)}…
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => copySecret(hook)}
                      aria-label="Copy signing secret"
                    >
                      {copiedId === hook.id ? <CheckIcon /> : <CopyIcon />}
                    </Button>
                    <span className="text-xs text-muted-foreground">Signing secret</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="deliveries" className="mt-4">
        {deliveries.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <WebhookIcon />
              </EmptyMedia>
              <EmptyTitle>No deliveries yet</EmptyTitle>
              <EmptyDescription>
                Delivery attempts will appear here after your first payment.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Response</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.event}</TableCell>
                  <TableCell>
                    <Badge variant={d.success ? "default" : "destructive"}>
                      {d.success ? "delivered" : "failed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {d.responseStatus ?? d.error ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(d.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TabsContent>
    </Tabs>
  )
}
