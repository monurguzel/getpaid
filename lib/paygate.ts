/**
 * PayGate.to API client.
 * Public API — no API key required. All calls are made server-side.
 */

const PAYGATE_API = 'https://api.paygate.to'
const PAYGATE_CHECKOUT = 'https://checkout.paygate.to'

export interface PayGateWalletResponse {
  address_in: string
  polygon_address_in?: string
  callback_url: string
  ipn_token?: string
}

/**
 * Payment providers supported by PayGate.to hosted checkout.
 */
export const PROVIDERS = [
  { id: 'wert', label: 'Wert', note: 'Cards, Apple Pay, Google Pay — recommended' },
  { id: 'moonpay', label: 'MoonPay', note: 'Cards, Apple Pay, bank transfers' },
  { id: 'transak', label: 'Transak', note: 'Cards and bank transfers' },
  { id: 'guardarian', label: 'Guardarian', note: 'Cards, SEPA' },
  { id: 'mercuryo', label: 'Mercuryo', note: 'Cards, Apple Pay, Google Pay' },
  { id: 'rampnetwork', label: 'Ramp', note: 'Cards, bank transfers' },
  { id: 'banxa', label: 'Banxa', note: 'Cards and local payment methods' },
] as const

export type ProviderId = (typeof PROVIDERS)[number]['id']

/**
 * Create a payment wallet on PayGate.
 * Supports commission splits: pass multiple wallets with percentages.
 * Split syntax: address=percent1|wallet1;percent2|wallet2 (percentages must sum to 100).
 */
export async function createPayGateWallet(opts: {
  merchantWallet: string
  callbackUrl: string
  commissionWallet?: string
  commissionPercent?: number
}): Promise<PayGateWalletResponse> {
  const { merchantWallet, callbackUrl, commissionWallet, commissionPercent } = opts

  let addressParam = merchantWallet
  const pct = commissionPercent ?? 0

  if (commissionWallet && pct > 0 && pct < 100) {
    const merchantPct = Math.round((100 - pct) * 100) / 100
    const platformPct = Math.round(pct * 100) / 100
    addressParam = `${merchantPct}|${merchantWallet};${platformPct}|${commissionWallet}`
  }

  const url = `${PAYGATE_API}/control/wallet.php?address=${encodeURIComponent(
    addressParam,
  )}&callback=${encodeURIComponent(callbackUrl)}`

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GetPaid/1.0)' },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`PayGate wallet.php failed with status ${res.status}`)
  }

  const data = (await res.json()) as PayGateWalletResponse

  if (!data.address_in) {
    // Split syntax may be unsupported — retry with single address (ledger fallback).
    if (addressParam !== merchantWallet) {
      return createPayGateWallet({ merchantWallet, callbackUrl })
    }
    throw new Error('PayGate did not return an address_in')
  }

  return data
}

/**
 * Build the hosted checkout URL for a payment.
 */
export function buildCheckoutUrl(opts: {
  addressIn: string
  amount: number
  provider: string
  email: string
  currency?: string
}): string {
  const { addressIn, amount, provider, email, currency = 'USD' } = opts
  const params = new URLSearchParams({
    address: addressIn,
    amount: amount.toFixed(2),
    provider,
    email,
    currency,
  })
  return `${PAYGATE_CHECKOUT}/process-payment.php?${params.toString()}`
}

/**
 * Validate a Polygon (EVM) wallet address.
 */
export function isValidWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}
