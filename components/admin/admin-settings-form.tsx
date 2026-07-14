"use client"

import { useState, useTransition } from "react"
import { updatePlatformSettings } from "@/app/actions/admin"
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

export function AdminSettingsForm({
  commissionPercent,
  commissionWallet,
}: {
  commissionPercent: number
  commissionWallet: string
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
      const result = await updatePlatformSettings({
        commissionPercent: Number.parseFloat(String(form.get("commissionPercent") ?? "0")),
        commissionWallet: String(form.get("commissionWallet") ?? ""),
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
          <CardTitle>Commission settings</CardTitle>
          <CardDescription>
            Applied to every new payment link via PayGate&apos;s payout split. Existing links keep
            the rate they were created with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="commissionPercent">Commission rate (%)</FieldLabel>
                <Input
                  id="commissionPercent"
                  name="commissionPercent"
                  type="number"
                  min="0"
                  max="99.99"
                  step="0.01"
                  defaultValue={commissionPercent}
                  required
                />
                <FieldDescription>
                  Percentage of each payment routed to the platform wallet.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="commissionWallet">Commission wallet (Polygon USDC)</FieldLabel>
                <Input
                  id="commissionWallet"
                  name="commissionWallet"
                  defaultValue={commissionWallet}
                  placeholder="0x..."
                  className="font-mono"
                />
                <FieldDescription>
                  Where your commission share is paid out.
                </FieldDescription>
              </Field>
            </div>
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
                <AlertDescription>Platform settings updated.</AlertDescription>
              </Alert>
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? "Saving..." : "Save settings"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
