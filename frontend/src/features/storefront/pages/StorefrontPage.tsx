import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useStore } from '../hooks/useStore'
import { publicApi } from '@/api/public'
import { PublicProduct } from '@/types/public'
import Header from '../components/Header'
import Banner from '../components/Banner'
import CategoryChips from '../components/CategoryChips'
import ProductGrid from '../components/ProductGrid'
import Footer from '../components/Footer'
import Spinner from '@/components/Spinner'

export default function StorefrontPage() {
  const { slug } = useParams<{ slug: string }>()
  const { store, isLoading: isLoadingStore, error: storeError } = useStore(slug!)

  const [products, setProducts] = useState<PublicProduct[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      if (!slug) return

      try {
        setIsLoadingProducts(true)
        const data = await publicApi.getProducts(slug, {
          category: selectedCategory || undefined,
        })
        setProducts(data.products)
        setCategories(data.categories)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoadingProducts(false)
      }
    }

    if (slug) {
      fetchProducts()
    }
  }, [slug, selectedCategory])

  if (isLoadingStore) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {store.sections.header && <Header store={store} />}

      {/* Banner */}
      {store.sections.banner && <Banner store={store} />}

      {/* Category Filter */}
      {categories.length > 0 && (
        <CategoryChips
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          store={store}
        />
      )}

      {/* Products Grid */}
      {store.sections.products && (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <ProductGrid
            products={products}
            store={store}
            isLoading={isLoadingProducts}
          />
        </div>
      )}

      {/* Footer */}
      {store.sections.footer && <Footer store={store} />}
    </div>
  )
}
