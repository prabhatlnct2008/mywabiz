import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ordersApi } from '@/api/orders'
import { OrderTracking, OrderStatus } from '@/types/order'
import Spinner from '@/components/Spinner'
import { CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon } from '@heroicons/react/24/solid'

export default function TrackingPage() {
  const { trackToken } = useParams<{ trackToken: string }>()
  const { t } = useTranslation()

  const [tracking, setTracking] = useState<OrderTracking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchTracking = async () => {
      if (!trackToken) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await ordersApi.track(trackToken)
        setTracking(data)
      } catch (err) {
        console.error('Failed to fetch tracking:', err)
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    if (trackToken) {
      fetchTracking()
    }
  }, [trackToken])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'initiated':
        return { label: 'Initiated', icon: ClockIcon, color: 'text-gray-500', bgColor: 'bg-gray-100' }
      case 'sent_to_whatsapp':
        return { label: 'Sent to WhatsApp', icon: ClockIcon, color: 'text-blue-500', bgColor: 'bg-blue-100' }
      case 'confirmed':
        return { label: t('tracking.confirmed'), icon: CheckCircleIcon, color: 'text-green-500', bgColor: 'bg-green-100' }
      case 'shipped':
        return { label: t('tracking.shipped'), icon: TruckIcon, color: 'text-blue-500', bgColor: 'bg-blue-100' }
      case 'delivered':
        return { label: t('tracking.delivered'), icon: CheckCircleIcon, color: 'text-green-500', bgColor: 'bg-green-100' }
      case 'cancelled':
        return { label: t('tracking.cancelled'), icon: XCircleIcon, color: 'text-red-500', bgColor: 'bg-red-100' }
      default:
        return { label: status, icon: ClockIcon, color: 'text-gray-500', bgColor: 'bg-gray-100' }
    }
  }

  const getStatusSteps = () => {
    return [
      { status: 'initiated', label: 'Initiated' },
      { status: 'confirmed', label: t('tracking.confirmed') },
      { status: 'shipped', label: t('tracking.shipped') },
      { status: 'delivered', label: t('tracking.delivered') },
    ]
  }

  const getCurrentStepIndex = (status: OrderStatus) => {
    const steps = ['initiated', 'confirmed', 'shipped', 'delivered']
    return steps.indexOf(status)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error || !tracking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order not found
          </h1>
          <p className="text-gray-600">
            Unable to find tracking information for this order.
          </p>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(tracking.status)
  const StatusIcon = statusInfo.icon
  const currentStep = getCurrentStepIndex(tracking.status)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">
            {t('tracking.track_order')}
          </h1>
          <p className="text-gray-600">
            {t('tracking.order_number')}: <span className="font-semibold">{tracking.order_number}</span>
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-full ${statusInfo.bgColor} flex items-center justify-center`}>
              <StatusIcon className={`w-7 h-7 ${statusInfo.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('tracking.status')}</p>
              <p className={`text-xl font-bold ${statusInfo.color}`}>
                {statusInfo.label}
              </p>
            </div>
          </div>

          {/* Status Timeline */}
          {tracking.status !== 'cancelled' && (
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
              <div className="relative flex justify-between">
                {getStatusSteps().map((step, index) => (
                  <div key={step.status} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                        index <= currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : (
                        <span className="text-sm font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center max-w-[80px]">
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {tracking.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <div className="text-sm text-gray-500">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.size && item.color && <span> • </span>}
                    {item.color && <span>Color: {item.color}</span>}
                    <span> • Qty: {item.quantity}</span>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatPrice(item.line_total)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-gray-900">{t('storefront.total')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(tracking.total)}
              </p>
            </div>
          </div>
        </div>

        {/* Store Info & WhatsApp */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {tracking.store_name}
          </h2>
          <a
            href={`https://wa.me/${tracking.store_whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-center transition-colors"
          >
            {t('tracking.chat_whatsapp')}
          </a>
        </div>
      </div>
    </div>
  )
}
