import { db } from '@/lib/db'
import { platformSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getSetting(key: string): Promise<string | null> {
  const rows = await db
    .select()
    .from(platformSettings)
    .where(eq(platformSettings.key, key))
    .limit(1)
  return rows[0]?.value ?? null
}

export async function getPlatformConfig() {
  const rows = await db.select().from(platformSettings)
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  return {
    commissionPercent: Number.parseFloat(map.commission_percent ?? '2.5'),
    commissionWallet: map.commission_wallet ?? '',
    brandName: map.brand_name ?? 'GetPaid',
  }
}

export async function setSetting(key: string, value: string) {
  await db
    .insert(platformSettings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: platformSettings.key,
      set: { value, updatedAt: new Date() },
    })
}
