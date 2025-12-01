import apiClient from './client'
import { Store, StoreCreate, StoreUpdate, StoreStats } from '@/types/store'

export const storesApi = {
  /**
   * Create a new store
   */
  async create(data: StoreCreate): Promise<Store> {
    const response = await apiClient.post('/stores', data)
    return response.data
  },

  /**
   * List all stores for current user
   */
  async list(): Promise<Store[]> {
    const response = await apiClient.get('/stores')
    return response.data
  },

  /**
   * Get a specific store
   */
  async get(storeId: string): Promise<Store> {
    const response = await apiClient.get(`/stores/${storeId}`)
    return response.data
  },

  /**
   * Update a store
   */
  async update(storeId: string, data: StoreUpdate): Promise<Store> {
    const response = await apiClient.patch(`/stores/${storeId}`, data)
    return response.data
  },

  /**
   * Delete a store
   */
  async delete(storeId: string): Promise<void> {
    await apiClient.delete(`/stores/${storeId}`)
  },

  /**
   * Get store statistics
   */
  async getStats(storeId: string, timeframe: string = '7d'): Promise<StoreStats> {
    const response = await apiClient.get(`/stores/${storeId}/stats`, {
      params: { timeframe },
    })
    return response.data
  },
}
