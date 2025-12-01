import { useState, useEffect } from 'react'
import { storesApi } from '@/api/stores'
import { StoreStats } from '@/types/store'

export function useStoreStats(storeId: string | undefined, timeframe: string = '7d') {
  const [stats, setStats] = useState<StoreStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      if (!storeId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const data = await storesApi.getStats(storeId, timeframe)
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [storeId, timeframe])

  return {
    stats,
    isLoading,
    error,
  }
}
