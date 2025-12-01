import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useStore } from '../hooks/useStore'
import { useCart } from '../hooks/useCart'
import { publicApi } from '@/api/public'
import { PublicProduct } from '@/types/public'
import ProductDetail from '../components/ProductDetail'
import Spinner from '@/components/Spinner'

export default function ProductPage() {
  const { slug, productId } = useParams<{ slug: string; productId: string }>()
  const { store, isLoading: isLoadingStore, error: storeError } = useStore(slug!)
  const { addItem } = useCart(slug!)

  const [product, setProduct] = useState<PublicProduct | null>(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [productError, setProductError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug || !productId) return

      try {
        setIsLoadingProduct(true)
        setProductError(null)
        const data = await publicApi.getProduct(slug, productId)
        setProduct(data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
        setProductError(error as Error)
      } finally {
        setIsLoadingProduct(false)
      }
    }

    if (slug && productId) {
      fetchProduct()
    }
  }, [slug, productId])

  if (isLoadingStore || isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (storeError || !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store not found</h1>
          <p className="text-gray-600">
            The store you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
          <p className="text-gray-600">
            The product you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ProductDetail
      product={product}
      store={store}
      onAddToCart={addItem}
    />
  )
}
