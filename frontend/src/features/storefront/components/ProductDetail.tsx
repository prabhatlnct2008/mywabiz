import { useState } from 'react'
import { PublicProduct, PublicStore } from '@/types/public'
import { useTranslation } from 'react-i18next'
import ImageGallery from './ImageGallery'
import VariantSelector from './VariantSelector'
import QuantitySelector from './QuantitySelector'
import AddToOrderButton from './AddToOrderButton'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

interface ProductDetailProps {
  product: PublicProduct
  store: PublicStore
  onAddToCart: (item: {
    product: PublicProduct
    size: string | null
    color: string | null
    quantity: number
  }) => void
}

export default function ProductDetail({ product, store, onAddToCart }: ProductDetailProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length > 0 ? product.sizes[0] : null
  )
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors.length > 0 ? product.colors[0] : null
  )
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    setIsAdding(true)

    // Validate variant selection
    if (product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size')
      setIsAdding(false)
      return
    }

    if (product.colors.length > 0 && !selectedColor) {
      alert('Please select a color')
      setIsAdding(false)
      return
    }

    onAddToCart({
      product,
      size: selectedSize,
      color: selectedColor,
      quantity,
    })

    setTimeout(() => {
      setIsAdding(false)
      navigate(`/${store.slug}/checkout`)
    }, 500)
  }

  const isOutOfStock = product.stock === 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(`/${store.slug}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Back to store</span>
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={product.image_urls} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Brand */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {product.category && <span>{product.category}</span>}
              {product.category && product.brand && <span>•</span>}
              {product.brand && <span>{product.brand}</span>}
            </div>

            {/* Name & Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-heading mb-3">
                {product.name}
              </h1>
              <p
                className="text-3xl font-bold"
                style={{ color: store.branding.brand_color }}
              >
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-sm text-gray-600">
                <p>{product.description}</p>
              </div>
            )}

            {/* Variant Selector */}
            {(product.sizes.length > 0 || product.colors.length > 0) && (
              <VariantSelector
                sizes={product.sizes}
                colors={product.colors}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onSelectSize={setSelectedSize}
                onSelectColor={setSelectedColor}
                brandColor={store.branding.brand_color}
              />
            )}

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <QuantitySelector
                quantity={quantity}
                maxQuantity={product.stock}
                onQuantityChange={setQuantity}
                brandColor={store.branding.brand_color}
              />
            )}

            {/* Add to Cart Button */}
            <div className="pt-4">
              <AddToOrderButton
                onClick={handleAddToCart}
                isLoading={isAdding}
                disabled={isOutOfStock}
                brandColor={store.branding.brand_color}
              />
            </div>

            {/* Stock Status */}
            {isOutOfStock && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">
                  {t('storefront.out_of_stock')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
