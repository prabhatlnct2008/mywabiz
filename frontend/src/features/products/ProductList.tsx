import { useState } from 'react'
import { Product } from '@/types/product'
import ProductCard from './ProductCard'
import EmptyState from '@/components/EmptyState'
import { ViewColumnsIcon, ListBulletIcon } from '@heroicons/react/24/outline'

interface ProductListProps {
  products: Product[]
  isLoading: boolean
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
}

export default function ProductList({
  products,
  isLoading,
  onEdit,
  onDelete,
}: ProductListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products yet"
        description="Start by adding your first product or sync from Google Sheets"
      />
    )
  }

  return (
    <div>
      {/* View mode toggle */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ViewColumnsIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Products grid/list */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                {product.thumbnail_url || product.image_urls[0] ? (
                  <img
                    src={product.thumbnail_url || product.image_urls[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                {product.category && (
                  <p className="text-sm text-gray-500">{product.category}</p>
                )}
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
