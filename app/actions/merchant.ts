'use server'

import { db } from '@/lib/db'
import { merchants } from '@/lib/db/schema'
import { getUserId, getOrCreateMerchant } from '@/lib/session'
import { isValidWalletAddress } from '@/lib/paygate'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getMerchantProfile() {
  const userId = await getUserId()
  return getOrCreateMerchant(userId)
}

export async function updateMerchantProfile(input: {
  businessName: string
  payoutWallet: string
}) {
  const userId = await getUserId()
  await getOrCreateMerchant(userId)

  const businessName = input.businessName.trim().slice(0, 120)
  const payoutWallet = input.payoutWallet.trim()

  if (payoutWallet && !isValidWalletAddress(payoutWallet)) {
    return { error: 'Invalid Polygon wallet address. It must start with 0x followed by 40 hex characters.' }
  }

  await db
    .update(merchants)
    .set({ businessName, payoutWallet, updatedAt: new Date() })
    .where(eq(merchants.userId, userId))

  revalidatePath('/dashboard', 'layout')
  return { success: true }
}
