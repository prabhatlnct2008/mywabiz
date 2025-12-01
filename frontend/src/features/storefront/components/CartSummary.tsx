import { useTranslation } from 'react-i18next'
import { TrashIcon } from '@heroicons/react/24/outline'

interface CartItem {
  id: string
  name: string
  price: number
  size: string | null
  color: string | null
  quantity: number
  image?: string
}

interface CartSummaryProps {
  items: CartItem[]
  onRemoveItem: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
  brandColor: string
}

export default function CartSummary({
  items,
  onRemoveItem,
  onUpdateQuantity,
  brandColor,
}: CartSummaryProps) {
  const { t } = useTranslation()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl p-4 flex gap-4 border border-gray-200"
        >
          {/* Product Image */}
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-300"
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
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              {item.size && <span>{item.size}</span>}
              {item.size && item.color && <span>•</span>}
              {item.color && <span>{item.color}</span>}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-gray-600">−</span>
                </button>
                <span className="text-gray-900 font-medium w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: brandColor }}
                >
                  <span className="text-white">+</span>
                </button>
              </div>
              <p className="font-bold text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemoveItem(item.id)}
            className="text-red-500 hover:text-red-600 transition-colors flex-shrink-0"
            aria-label="Remove item"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  )
}
