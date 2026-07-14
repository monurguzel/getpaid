import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
  numeric,
  jsonb,
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('merchant'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------

export const merchants = pgTable('merchants', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  businessName: text('business_name').notNull().default(''),
  payoutWallet: text('payout_wallet').notNull().default(''),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const paymentLinks = pgTable('payment_links', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  merchantId: integer('merchant_id').notNull(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  amount: numeric('amount', { precision: 12, scale: 2 }),
  currency: text('currency').notNull().default('USD'),
  provider: text('provider').notNull().default('wert'),
  addressIn: text('address_in').notNull().default(''),
  polygonAddressIn: text('polygon_address_in'),
  ipnToken: text('ipn_token'),
  callbackUrl: text('callback_url'),
  commissionPercent: numeric('commission_percent', { precision: 5, scale: 2 })
    .notNull()
    .default('0'),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  merchantId: integer('merchant_id').notNull(),
  linkId: integer('link_id').notNull(),
  amountFiat: numeric('amount_fiat', { precision: 12, scale: 2 }),
  currency: text('currency').notNull().default('USD'),
  amountUsdc: numeric('amount_usdc', { precision: 18, scale: 6 }),
  commissionUsdc: numeric('commission_usdc', { precision: 18, scale: 6 })
    .notNull()
    .default('0'),
  provider: text('provider'),
  txidIn: text('txid_in'),
  txidOut: text('txid_out'),
  customerEmail: text('customer_email'),
  status: text('status').notNull().default('completed'),
  rawPayload: jsonb('raw_payload'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const webhooks = pgTable('webhooks', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  merchantId: integer('merchant_id').notNull(),
  url: text('url').notNull(),
  secret: text('secret').notNull(),
  enabled: boolean('enabled').notNull().default(true),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const webhookDeliveries = pgTable('webhook_deliveries', {
  id: serial('id').primaryKey(),
  webhookId: integer('webhook_id').notNull(),
  transactionId: integer('transaction_id'),
  event: text('event').notNull(),
  payload: jsonb('payload'),
  responseStatus: integer('response_status'),
  success: boolean('success').notNull().default(false),
  error: text('error'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const platformSettings = pgTable('platform_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
