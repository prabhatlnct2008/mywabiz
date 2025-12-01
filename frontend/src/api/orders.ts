import apiClient from './client'
import { Order, OrderCreate, OrderUpdate, OrderTracking } from '@/types/order'

export const ordersApi = {
  /**
   * Create a new order (public - for buyers)
   */
  async create(storeId: string, data: OrderCreate): Promise<Order & { whatsapp_url: string }> {
    const response = await apiClient.post(`/stores/${storeId}/orders`, data)
    return response.data
  },

  /**
   * List orders for a store (merchant only)
   */
  async list(
    storeId: string,
    params?: { status?: string; page?: number; limit?: number }
  ): Promise<Order[]> {
    const response = await apiClient.get(`/stores/${storeId}/orders`, { params })
    return response.data
  },

  /**
   * Get a specific order (merchant only)
   */
  async get(storeId: string, orderId: string): Promise<Order> {
    const response = await apiClient.get(`/stores/${storeId}/orders/${orderId}`)
    return response.data
  },

  /**
   * Update order status (merchant only)
   */
  async update(storeId: string, orderId: string, data: OrderUpdate): Promise<Order> {
    const response = await apiClient.patch(`/stores/${storeId}/orders/${orderId}`, data)
    return response.data
  },

  /**
   * Track order (public)
   */
  async track(trackToken: string): Promise<OrderTracking> {
    const response = await apiClient.get(`/public/orders/track/${trackToken}`)
    return response.data
  },
}
