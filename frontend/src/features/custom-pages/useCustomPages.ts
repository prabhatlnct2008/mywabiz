import { useState, useEffect } from 'react'
import { pagesApi } from '@/api/pages'
import { CustomPage, CustomPageCreate, CustomPageUpdate } from '@/types/custom-page'

export const useCustomPages = (storeId: string) => {
  const [pages, setPages] = useState<CustomPage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPages = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await pagesApi.list(storeId)
      setPages(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  const createPage = async (data: CustomPageCreate) => {
    setError(null)
    try {
      const newPage = await pagesApi.create(storeId, data)
      setPages([...pages, newPage])
      return newPage
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to create page'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  const updatePage = async (pageId: string, data: CustomPageUpdate) => {
    setError(null)
    try {
      const updated = await pagesApi.update(storeId, pageId, data)
      setPages(pages.map((p) => (p.id === pageId ? updated : p)))
      return updated
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to update page'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  const deletePage = async (pageId: string) => {
    setError(null)
    try {
      await pagesApi.delete(storeId, pageId)
      setPages(pages.filter((p) => p.id !== pageId))
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to delete page'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  useEffect(() => {
    if (storeId) {
      fetchPages()
    }
  }, [storeId])

  return {
    pages,
    loading,
    error,
    createPage,
    updatePage,
    deletePage,
    refetch: fetchPages,
  }
}
