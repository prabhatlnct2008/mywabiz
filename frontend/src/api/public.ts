import apiClient from './client'
import { PublicStore, PublicProduct, PublicProductsResponse } from '@/types/public'

export const publicApi = {
  /**
   * Get public store by slug
   */
  async getStore(slug: string): Promise<PublicStore> {
    const response = await apiClient.get(`/public/stores/${slug}`)
    return response.data
  },

  /**
   * Get public products for a store
   */
  async getProducts(
    slug: string,
    params?: { category?: string; page?: number; limit?: number }
  ): Promise<PublicProductsResponse> {
    const response = await apiClient.get(`/public/stores/${slug}/products`, { params })
    return response.data
  },

  /**
   * Get a specific public product
   */
  async getProduct(slug: string, productId: string): Promise<PublicProduct> {
    const response = await apiClient.get(`/public/stores/${slug}/products/${productId}`)
    return response.data
  },
}
