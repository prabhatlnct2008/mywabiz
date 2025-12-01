export type Availability = 'show' | 'hide'
export type UpdateSource = 'sheet' | 'dashboard'

export interface Product {
  id: string
  store_id: string
  name: string
  category?: string
  price: number
  description?: string
  sizes: string[]
  colors: string[]
  tags: string[]
  brand?: string
  stock: number
  availability: Availability
  thumbnail_url?: string
  image_urls: string[]
  last_updated_source: UpdateSource
  created_at: string
  updated_at: string
}

export interface ProductCreate {
  name: string
  category?: string
  price: number
  description?: string
  sizes?: string[]
  colors?: string[]
  tags?: string[]
  brand?: string
  stock?: number
  availability?: Availability
  thumbnail_url?: string
  image_urls?: string[]
}

export interface ProductUpdate {
  name?: string
  category?: string
  price?: number
  description?: string
  sizes?: string[]
  colors?: string[]
  tags?: string[]
  brand?: string
  stock?: number
  availability?: Availability
  thumbnail_url?: string
  image_urls?: string[]
}

export interface SyncResponse {
  success: boolean
  products_synced: number
  products_skipped: number
  errors: string[]
}
