import { PublicProduct } from '@/types/public'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface ProductCardProps {
  product: PublicProduct
  storeSlug: string
  brandColor: string
}

export default function ProductCard({ product, storeSlug, brandColor }: ProductCardProps) {
  const { t } = useTranslation()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const isOutOfStock = product.stock === 0

  return (
    <Link
      to={`/${storeSlug}/product/${product.id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.thumbnail_url || product.image_urls[0] ? (
          <img
            src={product.thumbnail_url || product.image_urls[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
              {t('storefront.out_of_stock')}
            </span>
          </div>
        )}
        {!isOutOfStock && product.stock <= 5 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {t('storefront.only_left', { count: product.stock })}
          </div>
        )}
      </div>
      <div className="p-4">
        {product.category && (
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        )}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-baseline justify-between">
          <p className="text-lg font-bold" style={{ color: brandColor }}>
            {formatPrice(product.price)}
          </p>
          {(product.sizes.length > 0 || product.colors.length > 0) && (
            <p className="text-xs text-gray-500">
              {product.sizes.length > 0 && `${product.sizes.length} sizes`}
              {product.sizes.length > 0 && product.colors.length > 0 && ', '}
              {product.colors.length > 0 && `${product.colors.length} colors`}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
