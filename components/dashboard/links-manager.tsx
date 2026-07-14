"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { createPaymentLink, setLinkStatus } from "@/app/actions/links"
import { PROVIDERS } from "@/lib/paygate"
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import {
  AlertCircleIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  LinkIcon,
  PlusIcon,
} from "lucide-react"

interface LinkRow {
  id: number
  slug: string
  title: string
  description: string | null
  amount: string | null
  currency: string
  provider: string
  status: string
  createdAt: string
}

export function LinksManager({
  links,
  hasWallet,
}: {
  links: LinkRow[]
  hasWallet: boolean
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const amountRaw = String(form.get("amount") ?? "").trim()
    startTransition(async () => {
      const result = await createPaymentLink({
        title: String(form.get("title") ?? ""),
        description: String(form.get("description") ?? ""),
        amount: amountRaw ? Number.parseFloat(amountRaw) : null,
        currency: String(form.get("currency") ?? "USD"),
        provider: String(form.get("provider") ?? "wert"),
      })
      if (result?.error) {
        setError(result.error)
      } else {
        setOpen(false)
      }
    })
  }

  function copyLink(link: LinkRow) {
    navigator.clipboard.writeText(`${window.location.origin}/pay/${link.slug}`)
    setCopiedId(link.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="flex flex-col gap-4">
      {!hasWallet && (
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>Payout wallet required</AlertTitle>
          <AlertDescription>
            Add your Polygon USDC wallet address in{" "}
            <Link href="/dashboard/settings" className="underline underline-offset-2">
              Settings
            </Link>{" "}
            before creating payment links.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={!hasWallet}>
              <PlusIcon data-icon="inline-start" />
              New payment link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create payment link</DialogTitle>
              <DialogDescription>
                Your customer pays by card or Apple Pay. You receive USDC on Polygon.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input id="title" name="title" placeholder="Order #1234" required maxLength={120} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Description (optional)</FieldLabel>
                  <Textarea id="description" name="description" placeholder="What is the customer paying for?" maxLength={500} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="amount">Amount (optional)</FieldLabel>
                    <Input id="amount" name="amount" type="number" min="1" step="0.01" placeholder="99.00" />
                    <FieldDescription>Leave empty to let the customer choose.</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="currency">Currency</FieldLabel>
                    <Select name="currency" defaultValue="USD">
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="provider">Payment provider</FieldLabel>
                  <Select name="provider" defaultValue="wert">
                    <SelectTrigger id="provider">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {PROVIDERS.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.label} — {p.note}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>Could not create link</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </FieldGroup>
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={isPending}>
                  {isPending && <Spinner data-icon="inline-start" />}
                  {isPending ? "Creating..." : "Create link"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {links.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LinkIcon />
            </EmptyMedia>
            <EmptyTitle>No payment links yet</EmptyTitle>
            <EmptyDescription>
              Create your first payment link to start accepting card payments.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your links</CardTitle>
            <CardDescription>
              Share these URLs with customers or embed them in your store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">{link.title}</TableCell>
                    <TableCell>
                      {link.amount ? `${link.amount} ${link.currency}` : "Customer chooses"}
                    </TableCell>
                    <TableCell className="capitalize">{link.provider}</TableCell>
                    <TableCell>
                      <Badge variant={link.status === "active" ? "default" : "secondary"}>
                        {link.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => copyLink(link)}
                          aria-label="Copy payment URL"
                        >
                          {copiedId === link.id ? <CheckIcon /> : <CopyIcon />}
                        </Button>
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link href={`/pay/${link.slug}`} target="_blank" aria-label="Open payment page">
                            <ExternalLinkIcon />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setLinkStatus(link.id, link.status === "active" ? "disabled" : "active")
                          }
                        >
                          {link.status === "active" ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
