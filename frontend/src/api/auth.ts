import apiClient from './client'
import { User } from '@/types/user'

export const authApi = {
  /**
   * Get current authenticated user
   */
  async getMe(): Promise<User> {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  /**
   * Get Google OAuth URL
   */
  getGoogleAuthUrl(): string {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    return `${apiUrl}/api/v1/auth/google`
  },
}
