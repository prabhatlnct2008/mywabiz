import { useState, useEffect, useCallback } from 'react'
import { Store } from '@/types/store'
import { storesApi } from '@/api/stores'

const CURRENT_STORE_KEY = 'mywabiz_current_store_id'

interface UseStoreReturn {
  store: Store | null
  stores: Store[]
  isLoading: boolean
  error: string | null
  refreshStore: () => Promise<void>
  setCurrentStore: (storeId: string) => void
}

export function useStore(): UseStoreReturn {
  const [store, setStore] = useState<Store | null>(null)
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStores = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const fetchedStores = await storesApi.list()
      setStores(fetchedStores)

      if (fetchedStores.length > 0) {
        // Check if there's a stored current store ID
        const savedStoreId = localStorage.getItem(CURRENT_STORE_KEY)
        const currentStore = savedStoreId
          ? fetchedStores.find(s => s.id === savedStoreId) || fetchedStores[0]
          : fetchedStores[0]

        setStore(currentStore)
        localStorage.setItem(CURRENT_STORE_KEY, currentStore.id)
      } else {
        setStore(null)
      }
    } catch (err) {
      setError('Failed to load store')
      console.error('Error fetching stores:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshStore = useCallback(async () => {
    if (store) {
      try {
        const updatedStore = await storesApi.get(store.id)
        setStore(updatedStore)
        setStores(prev => prev.map(s => s.id === updatedStore.id ? updatedStore : s))
      } catch (err) {
        console.error('Error refreshing store:', err)
      }
    } else {
      await fetchStores()
    }
  }, [store, fetchStores])

  const setCurrentStore = useCallback((storeId: string) => {
    const selectedStore = stores.find(s => s.id === storeId)
    if (selectedStore) {
      setStore(selectedStore)
      localStorage.setItem(CURRENT_STORE_KEY, storeId)
    }
  }, [stores])

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  return {
    store,
    stores,
    isLoading,
    error,
    refreshStore,
    setCurrentStore,
  }
}

export default useStore
