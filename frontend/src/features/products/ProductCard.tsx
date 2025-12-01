import { Product } from '@/types/product'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 relative">
        {product.thumbnail_url || product.image_urls[0] ? (
          <img
            src={product.thumbnail_url || product.image_urls[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Availability badge */}
        {product.availability === 'hide' && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
            Hidden
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate mb-1">
          {product.name}
        </h3>

        {product.category && (
          <p className="text-xs text-gray-500 mb-2">{product.category}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
          <p className="text-sm text-gray-500">
            Stock: {product.stock > 0 ? product.stock : 'Out'}
          </p>
        </div>

        {/* Tags */}
        {(product.sizes.length > 0 || product.colors.length > 0) && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.sizes.slice(0, 2).map((size) => (
              <span
                key={size}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {size}
              </span>
            ))}
            {product.colors.slice(0, 2).map((color) => (
              <span
                key={color}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {color}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
