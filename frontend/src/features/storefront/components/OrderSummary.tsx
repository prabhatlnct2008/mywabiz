import { useTranslation } from 'react-i18next'

interface OrderSummaryProps {
  subtotal: number
  shippingFee: number
  discountAmount: number
  total: number
  itemCount: number
  brandColor: string
}

export default function OrderSummary({
  subtotal,
  shippingFee,
  discountAmount,
  total,
  itemCount,
  brandColor,
}: OrderSummaryProps) {
  const { t } = useTranslation()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        {t('storefront.order_summary')}
      </h2>

      <div className="space-y-3 py-4 border-t border-b border-gray-200">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-600">
          <span>
            {t('storefront.subtotal')} ({itemCount}{' '}
            {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-gray-600">
          <span>{t('storefront.shipping')}</span>
          <span className="font-medium">
            {shippingFee === 0
              ? t('storefront.free')
              : formatPrice(shippingFee)}
          </span>
        </div>

        {/* Discount */}
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-medium">-{formatPrice(discountAmount)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-baseline pt-2">
        <span className="text-xl font-bold text-gray-900">
          {t('storefront.total')}
        </span>
        <span
          className="text-2xl font-bold"
          style={{ color: brandColor }}
        >
          {formatPrice(total)}
        </span>
      </div>

      {/* WhatsApp Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <p className="text-sm text-blue-800">
          💬 {t('storefront.whatsapp_note')}
        </p>
      </div>
    </div>
  )
}
