"use client"

import { setMerchantStatus } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { UsersIcon } from "lucide-react"

interface MerchantRow {
  id: number
  businessName: string
  email: string | null
  name: string | null
  payoutWallet: string
  status: string
  linkCount: number
  totalUsdc: string
  totalCommission: string
  createdAt: string
}

export function AdminMerchantsTable({ merchants }: { merchants: MerchantRow[] }) {
  if (merchants.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UsersIcon />
          </EmptyMedia>
          <EmptyTitle>No merchants yet</EmptyTitle>
          <EmptyDescription>Merchants will appear here after they sign up.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Merchant</TableHead>
          <TableHead>Wallet</TableHead>
          <TableHead>Links</TableHead>
          <TableHead>Volume</TableHead>
          <TableHead>Commission</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {merchants.map((m) => (
          <TableRow key={m.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{m.businessName || m.name || "—"}</span>
                <span className="text-xs text-muted-foreground">{m.email ?? "—"}</span>
              </div>
            </TableCell>
            <TableCell>
              {m.payoutWallet ? (
                <span className="font-mono text-xs">
                  {m.payoutWallet.slice(0, 6)}…{m.payoutWallet.slice(-4)}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Not set</span>
              )}
            </TableCell>
            <TableCell className="tabular-nums">{m.linkCount}</TableCell>
            <TableCell className="font-mono text-xs">
              {Number.parseFloat(m.totalUsdc).toFixed(2)} USDC
            </TableCell>
            <TableCell className="font-mono text-xs">
              {Number.parseFloat(m.totalCommission).toFixed(2)} USDC
            </TableCell>
            <TableCell>
              <Badge variant={m.status === "active" ? "default" : "destructive"}>
                {m.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setMerchantStatus(m.id, m.status === "active" ? "suspended" : "active")
                }
              >
                {m.status === "active" ? "Suspend" : "Activate"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
