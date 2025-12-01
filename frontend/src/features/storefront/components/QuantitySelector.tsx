import { useTranslation } from 'react-i18next'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

interface QuantitySelectorProps {
  quantity: number
  maxQuantity: number
  onQuantityChange: (quantity: number) => void
  brandColor: string
}

export default function QuantitySelector({
  quantity,
  maxQuantity,
  onQuantityChange,
  brandColor,
}: QuantitySelectorProps) {
  const { t } = useTranslation()

  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('storefront.quantity')}
      </label>
      <div className="flex items-center gap-3">
        <button
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Decrease quantity"
        >
          <MinusIcon className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-xl font-semibold text-gray-900 w-12 text-center">
          {quantity}
        </span>
        <button
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity}
          className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: quantity >= maxQuantity ? '#D1D5DB' : brandColor,
            backgroundColor: quantity >= maxQuantity ? 'transparent' : brandColor,
          }}
          aria-label="Increase quantity"
        >
          <PlusIcon
            className="w-5 h-5"
            style={{ color: quantity >= maxQuantity ? '#6B7280' : 'white' }}
          />
        </button>
      </div>
      {maxQuantity <= 10 && (
        <p className="text-sm text-gray-500 mt-2">
          {maxQuantity > 1
            ? t('storefront.only_left', { count: maxQuantity })
            : t('storefront.out_of_stock')}
        </p>
      )}
    </div>
  )
}
