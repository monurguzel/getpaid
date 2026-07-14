"use client"

import { useState, useTransition } from "react"
import { buildCheckoutUrl } from "@/lib/paygate"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { CreditCardIcon } from "lucide-react"

export function CheckoutCard({
  title,
  description,
  amount,
  currency,
  provider,
  addressIn,
  businessName,
}: {
  title: string
  description: string | null
  amount: string | null
  currency: string
  provider: string
  addressIn: string
  businessName: string
}) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const fixedAmount = amount ? Number.parseFloat(amount) : null

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const email = String(form.get("email") ?? "").trim()
    const payAmount =
      fixedAmount ?? Number.parseFloat(String(form.get("amount") ?? "0"))

    if (!email) {
      setError("Please enter your email address.")
      return
    }
    if (!Number.isFinite(payAmount) || payAmount < 1) {
      setError("Please enter a valid amount (minimum 1).")
      return
    }

    startTransition(() => {
      const url = buildCheckoutUrl({
        addressIn,
        amount: payAmount,
        provider,
        email,
        currency,
      })
      // Open in a new tab when embedded in an iframe (e.g. the v0 preview).
      if (window.self !== window.top) {
        window.open(url, "_blank", "noopener")
      } else {
        window.location.href = url
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>{businessName}</CardDescription>
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && (
          <CardDescription className="text-pretty">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form id="checkout-form" onSubmit={handleSubmit}>
          <FieldGroup>
            {fixedAmount != null ? (
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Amount due</span>
                <span className="text-3xl font-semibold tracking-tight">
                  {fixedAmount.toFixed(2)}{" "}
                  <span className="text-base font-normal text-muted-foreground">{currency}</span>
                </span>
              </div>
            ) : (
              <Field>
                <FieldLabel htmlFor="amount">Amount ({currency})</FieldLabel>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="100.00"
                  required
                />
              </Field>
            )}
            <Separator />
            <Field data-invalid={error ? true : undefined}>
              <FieldLabel htmlFor="email">Email for receipt</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                aria-invalid={error ? true : undefined}
              />
              {error ? (
                <FieldDescription className="text-destructive">{error}</FieldDescription>
              ) : (
                <FieldDescription>
                  You&apos;ll be redirected to a secure payment page.
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="checkout-form" className="w-full" size="lg" disabled={isPending}>
          {isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <CreditCardIcon data-icon="inline-start" />
          )}
          {isPending ? "Redirecting..." : "Pay with card or Apple Pay"}
        </Button>
      </CardFooter>
    </Card>
  )
}
