export type Language = 'en' | 'hi' | 'pa' | 'hr' | 'gu'
export type Template = 'multi-purpose' | 'quick-order' | 'wholesale' | 'digital-download' | 'service-booking' | 'links-list' | 'blank'
export type Theme = 'minimal' | 'bold' | 'dark'
export type Plan = 'starter' | 'growth' | 'pro'
export type SyncStatus = 'idle' | 'syncing' | 'error'

export interface StoreBranding {
  logo_url?: string
  brand_color: string
  banner_url?: string
  banner_text?: string
}

export interface StoreSections {
  header: boolean
  banner: boolean
  products: boolean
  footer: boolean
}

export interface StorePremium {
  plan: Plan
  coupons_enabled: boolean
  custom_pages_enabled: boolean
  branding_removal: boolean
  product_limit: number
}

export interface SheetsConfig {
  sheet_id?: string
  sheet_url?: string
  last_synced_at?: string
  sync_status: SyncStatus
  sync_error?: string
}

export interface ShippingConfig {
  pickup_enabled: boolean
  pickup_address?: string
  delivery_enabled: boolean
  delivery_fee: number
  delivery_zones: string[]
}

export interface PaymentConfig {
  cod_enabled: boolean
  paypal_enabled: boolean
  paypal_client_id?: string
}

export interface Store {
  id: string
  owner_id: string
  name: string
  slug: string
  url?: string
  whatsapp_number: string
  language: Language
  template: Template
  theme: Theme
  branding: StoreBranding
  sections: StoreSections
  premium: StorePremium
  sheets_config: SheetsConfig
  shipping: ShippingConfig
  payments: PaymentConfig
  created_at: string
  updated_at: string
}

export interface StoreCreate {
  name: string
  whatsapp_number: string
  language: Language
  template: Template
}

export interface StoreUpdate {
  name?: string
  whatsapp_number?: string
  language?: Language
  template?: Template
  theme?: Theme
  branding?: Partial<StoreBranding>
  sections?: Partial<StoreSections>
  sheets_config?: Partial<SheetsConfig>
  shipping?: Partial<ShippingConfig>
  payments?: Partial<PaymentConfig>
}

export interface StoreStats {
  orders_count: number
  sales_total: number
  visits: number
  timeframe: string
}
