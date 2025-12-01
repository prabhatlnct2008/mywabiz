import { useState, useEffect, useCallback } from 'react'
import { productsApi } from '@/api/products'
import { Product, ProductCreate, ProductUpdate } from '@/types/product'
import toast from 'react-hot-toast'

export function useProducts(storeId: string | undefined) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    if (!storeId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const data = await productsApi.list(storeId)
      setProducts(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }, [storeId])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const createProduct = async (data: ProductCreate) => {
    if (!storeId) return

    try {
      const newProduct = await productsApi.create(storeId, data)
      setProducts([...products, newProduct])
      toast.success('Product created successfully')
      return newProduct
    } catch (err) {
      toast.error('Failed to create product')
      throw err
    }
  }

  const updateProduct = async (productId: string, data: ProductUpdate) => {
    if (!storeId) return

    try {
      const updatedProduct = await productsApi.update(storeId, productId, data)
      setProducts(products.map((p) => (p.id === productId ? updatedProduct : p)))
      toast.success('Product updated successfully')
      return updatedProduct
    } catch (err) {
      toast.error('Failed to update product')
      throw err
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!storeId) return

    try {
      await productsApi.delete(storeId, productId)
      setProducts(products.filter((p) => p.id !== productId))
      toast.success('Product deleted successfully')
    } catch (err) {
      toast.error('Failed to delete product')
      throw err
    }
  }

  const syncProducts = async () => {
    if (!storeId) return

    try {
      const result = await productsApi.sync(storeId)
      toast.success(`Synced ${result.products_synced} products`)
      await fetchProducts()
      return result
    } catch (err) {
      toast.error('Failed to sync products')
      throw err
    }
  }

  return {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    syncProducts,
    refetch: fetchProducts,
  }
}
