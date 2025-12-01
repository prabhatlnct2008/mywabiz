import { useState, useEffect } from 'react'
import { PublicStore } from '@/types/public'
import { publicApi } from '@/api/public'
import i18n from '@/i18n'

export function useStore(slug: string) {
  const [store, setStore] = useState<PublicStore | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await publicApi.getStore(slug)
        setStore(data)

        // Set i18n language based on store settings
        if (data.language && i18n.language !== data.language) {
          i18n.changeLanguage(data.language)
        }
      } catch (err) {
        setError(err as Error)
        console.error('Failed to fetch store:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchStore()
    }
  }, [slug])

  return { store, isLoading, error }
}
