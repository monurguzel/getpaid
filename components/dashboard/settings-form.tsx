"use client"

import { useState, useTransition } from "react"
import { updateMerchantProfile } from "@/app/actions/merchant"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircleIcon, CheckIcon } from "lucide-react"

export function SettingsForm({
  businessName,
  payoutWallet,
}: {
  businessName: string
  payoutWallet: string
}) {
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    const form = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateMerchantProfile({
        businessName: String(form.get("businessName") ?? ""),
        payoutWallet: String(form.get("payoutWallet") ?? ""),
      })
      if (result?.error) {
        setError(result.error)
      } else {
        setSaved(true)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Business profile</CardTitle>
          <CardDescription>
            Shown on your hosted checkout pages so customers know who they&apos;re paying.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="businessName">Business name</FieldLabel>
              <Input
                id="businessName"
                name="businessName"
                defaultValue={businessName}
                placeholder="Acme Labs"
                maxLength={120}
              />
            </Field>
            <Field data-invalid={error ? true : undefined}>
              <FieldLabel htmlFor="payoutWallet">Payout wallet (Polygon USDC)</FieldLabel>
              <Input
                id="payoutWallet"
                name="payoutWallet"
                defaultValue={payoutWallet}
                placeholder="0x..."
                className="font-mono"
                aria-invalid={error ? true : undefined}
              />
              <FieldDescription>
                Your USDC payouts are sent to this address on the Polygon network. Double-check it —
                crypto transfers cannot be reversed.
              </FieldDescription>
            </Field>
            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Could not save</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {saved && (
              <Alert>
                <CheckIcon />
                <AlertTitle>Saved</AlertTitle>
                <AlertDescription>Your settings have been updated.</AlertDescription>
              </Alert>
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
