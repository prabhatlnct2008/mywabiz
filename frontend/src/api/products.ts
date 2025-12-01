import apiClient from './client'
import { Product, ProductCreate, ProductUpdate, SyncResponse } from '@/types/product'

export const productsApi = {
  /**
   * Create a new product
   */
  async create(storeId: string, data: ProductCreate): Promise<Product> {
    const response = await apiClient.post(`/stores/${storeId}/products`, data)
    return response.data
  },

  /**
   * List products for a store
   */
  async list(
    storeId: string,
    params?: { category?: string; page?: number; limit?: number }
  ): Promise<Product[]> {
    const response = await apiClient.get(`/stores/${storeId}/products`, { params })
    return response.data
  },

  /**
   * Get a specific product
   */
  async get(storeId: string, productId: string): Promise<Product> {
    const response = await apiClient.get(`/stores/${storeId}/products/${productId}`)
    return response.data
  },

  /**
   * Update a product
   */
  async update(storeId: string, productId: string, data: ProductUpdate): Promise<Product> {
    const response = await apiClient.patch(`/stores/${storeId}/products/${productId}`, data)
    return response.data
  },

  /**
   * Delete a product
   */
  async delete(storeId: string, productId: string): Promise<void> {
    await apiClient.delete(`/stores/${storeId}/products/${productId}`)
  },

  /**
   * Sync products from Google Sheet
   */
  async sync(storeId: string): Promise<SyncResponse> {
    const response = await apiClient.post(`/stores/${storeId}/products/sync`)
    return response.data
  },
}
