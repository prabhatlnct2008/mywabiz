export type ShippingMethod = 'pickup' | 'delivery'
export type PaymentMethod = 'cash' | 'paypal'
export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type OrderStatus = 'initiated' | 'sent_to_whatsapp' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderCustomer {
  name: string
  email?: string
  phone: string
  address?: string
  custom_fields: Record<string, unknown>
}

export interface OrderItem {
  product_id: string
  name: string
  size?: string
  color?: string
  quantity: number
  unit_price: number
  line_total: number
}

export interface Order {
  id: string
  store_id: string
  order_number: string
  customer: OrderCustomer
  items: OrderItem[]
  currency: string
  subtotal: number
  shipping_method: ShippingMethod
  shipping_fee: number
  discount_amount: number
  coupon_code?: string
  total: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  status: OrderStatus
  track_token: string
  whatsapp_url?: string
  created_at: string
  updated_at: string
}

export interface OrderItemCreate {
  product_id: string
  size?: string
  color?: string
  quantity: number
}

export interface OrderCustomerCreate {
  name: string
  email?: string
  phone: string
  address?: string
  custom_fields?: Record<string, unknown>
}

export interface OrderCreate {
  items: OrderItemCreate[]
  customer: OrderCustomerCreate
  shipping_method: ShippingMethod
  coupon_code?: string
  payment_method?: PaymentMethod
}

export interface OrderUpdate {
  status?: OrderStatus
  payment_status?: PaymentStatus
}

export interface OrderTracking {
  order_number: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  currency: string
  created_at: string
  store_name: string
  store_whatsapp: string
}
