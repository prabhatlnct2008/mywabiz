import { StoreBranding, StoreSections, Theme, Language } from './store'

export interface PublicStore {
  id: string
  name: string
  slug: string
  language: Language
  theme: Theme
  branding: StoreBranding
  sections: StoreSections
  shipping: {
    pickup_enabled: boolean
    delivery_enabled: boolean
    delivery_fee: number
  }
  payments: {
    cod_enabled: boolean
  }
  whatsapp_number: string
}

export interface PublicProduct {
  id: string
  name: string
  category?: string
  price: number
  description?: string
  sizes: string[]
  colors: string[]
  brand?: string
  stock: number
  thumbnail_url?: string
  image_urls: string[]
}

export interface PublicProductsResponse {
  products: PublicProduct[]
  categories: string[]
  total: number
}
