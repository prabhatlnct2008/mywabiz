import { useState } from 'react'
import { ordersApi } from '@/api/orders'
import { OrderCreate, Order } from '@/types/order'
import { CartItem } from './useCart'

interface CheckoutResult {
  order: Order & { whatsapp_url: string }
  success: boolean
  error?: string
}

export function useCheckout(storeId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitOrder = async (
    orderData: OrderCreate,
    cartItems: CartItem[]
  ): Promise<CheckoutResult | null> => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Map cart items to order items
      const items = cartItems.map((item) => ({
        product_id: item.productId,
        size: item.size || undefined,
        color: item.color || undefined,
        quantity: item.quantity,
      }))

      const orderPayload: OrderCreate = {
        ...orderData,
        items,
      }

      const result = await ordersApi.create(storeId, orderPayload)

      return {
        order: result,
        success: true,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit order'
      setError(errorMessage)
      console.error('Checkout error:', err)
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateCheckoutData = (data: OrderCreate): string[] => {
    const errors: string[] = []

    if (!data.customer.name || data.customer.name.trim().length === 0) {
      errors.push('Name is required')
    }

    if (!data.customer.phone || data.customer.phone.trim().length === 0) {
      errors.push('Phone number is required')
    } else {
      // Validate phone format (Indian format)
      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(data.customer.phone.replace(/\s/g, ''))) {
        errors.push('Invalid phone number format')
      }
    }

    if (data.customer.email && data.customer.email.trim().length > 0) {
      // Validate email format if provided
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.customer.email)) {
        errors.push('Invalid email format')
      }
    }

    if (data.shipping_method === 'delivery') {
      if (!data.customer.address || data.customer.address.trim().length === 0) {
        errors.push('Delivery address is required')
      }
    }

    if (!data.items || data.items.length === 0) {
      errors.push('Cart is empty')
    }

    return errors
  }

  return {
    submitOrder,
    validateCheckoutData,
    isSubmitting,
    error,
  }
}
