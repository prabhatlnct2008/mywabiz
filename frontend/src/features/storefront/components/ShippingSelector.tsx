import { useTranslation } from 'react-i18next'
import { ShippingMethod } from '@/types/order'
import { TruckIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

interface ShippingSelectorProps {
  selectedMethod: ShippingMethod
  onSelectMethod: (method: ShippingMethod) => void
  pickupEnabled: boolean
  deliveryEnabled: boolean
  deliveryFee: number
  brandColor: string
}

export default function ShippingSelector({
  selectedMethod,
  onSelectMethod,
  pickupEnabled,
  deliveryEnabled,
  deliveryFee,
  brandColor,
}: ShippingSelectorProps) {
  const { t } = useTranslation()

  const formatPrice = (price: number) => {
    if (price === 0) return t('storefront.free')
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {t('storefront.shipping')}
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Pickup Option */}
        {pickupEnabled && (
          <button
            onClick={() => onSelectMethod('pickup')}
            className={clsx(
              'p-4 rounded-xl border-2 text-left transition-all',
              selectedMethod === 'pickup'
                ? 'border-current shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            )}
            style={
              selectedMethod === 'pickup'
                ? { borderColor: brandColor }
                : undefined
            }
          >
            <div className="flex items-start gap-3">
              <BuildingStorefrontIcon
                className="w-6 h-6 flex-shrink-0"
                style={
                  selectedMethod === 'pickup'
                    ? { color: brandColor }
                    : { color: '#6B7280' }
                }
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {t('storefront.pickup')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {t('storefront.free')}
                </p>
              </div>
              {selectedMethod === 'pickup' && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: brandColor }}
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M4.5 9.5L1 6l1-1 2.5 2.5L9.5 2.5 10.5 3.5z" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        )}

        {/* Delivery Option */}
        {deliveryEnabled && (
          <button
            onClick={() => onSelectMethod('delivery')}
            className={clsx(
              'p-4 rounded-xl border-2 text-left transition-all',
              selectedMethod === 'delivery'
                ? 'border-current shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            )}
            style={
              selectedMethod === 'delivery'
                ? { borderColor: brandColor }
                : undefined
            }
          >
            <div className="flex items-start gap-3">
              <TruckIcon
                className="w-6 h-6 flex-shrink-0"
                style={
                  selectedMethod === 'delivery'
                    ? { color: brandColor }
                    : { color: '#6B7280' }
                }
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {t('storefront.delivery')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatPrice(deliveryFee)}
                </p>
              </div>
              {selectedMethod === 'delivery' && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: brandColor }}
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M4.5 9.5L1 6l1-1 2.5 2.5L9.5 2.5 10.5 3.5z" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
