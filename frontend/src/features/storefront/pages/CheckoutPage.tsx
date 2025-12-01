import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../hooks/useStore'
import { useCart } from '../hooks/useCart'
import { useCheckout } from '../hooks/useCheckout'
import { ShippingMethod } from '@/types/order'
import Header from '../components/Header'
import CartSummary from '../components/CartSummary'
import CheckoutForm from '../components/CheckoutForm'
import ShippingSelector from '../components/ShippingSelector'
import OrderSummary from '../components/OrderSummary'
import Spinner from '@/components/Spinner'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { store, isLoading: isLoadingStore } = useStore(slug!)
  const { items, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart(slug!)
  const { submitOrder, isSubmitting } = useCheckout(store?.id || '')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  })

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(() => {
    if (store?.shipping.pickup_enabled) return 'pickup'
    if (store?.shipping.delivery_enabled) return 'delivery'
    return 'pickup'
  })

  const shippingFee = shippingMethod === 'delivery' ? (store?.shipping.delivery_fee || 0) : 0
  const discountAmount = 0 // TODO: Implement coupon logic later
  const total = subtotal + shippingFee - discountAmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!store || items.length === 0) {
      alert('Your cart is empty')
      return
    }

    // Validate form
    if (!formData.name.trim()) {
      alert('Please enter your name')
      return
    }

    if (!formData.phone.trim()) {
      alert('Please enter your phone number')
      return
    }

    if (shippingMethod === 'delivery' && !formData.address.trim()) {
      alert('Please enter your delivery address')
      return
    }

    // Submit order
    const result = await submitOrder(
      {
        items: [], // Will be populated by hook
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          address: formData.address || undefined,
        },
        shipping_method: shippingMethod,
        payment_method: 'cash',
      },
      items
    )

    if (result?.success) {
      // Clear cart
      clearCart()

      // Navigate to confirmation with order data
      navigate(`/${slug}/confirmation`, {
        state: {
          order: result.order,
        },
      })
    } else {
      alert('Failed to submit order. Please try again.')
    }
  }

  if (isLoadingStore) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store not found</h1>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header store={store} />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <button
            onClick={() => navigate(`/${slug}`)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Continue shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header store={store} />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/${slug}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Back to store</span>
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 font-heading mb-8">
          {t('storefront.checkout')}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Cart & Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cart Summary */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Order</h2>
                <CartSummary
                  items={items}
                  onRemoveItem={removeItem}
                  onUpdateQuantity={updateQuantity}
                  brandColor={store.branding.brand_color}
                />
              </div>

              {/* Shipping Method */}
              <ShippingSelector
                selectedMethod={shippingMethod}
                onSelectMethod={setShippingMethod}
                pickupEnabled={store.shipping.pickup_enabled}
                deliveryEnabled={store.shipping.delivery_enabled}
                deliveryFee={store.shipping.delivery_fee}
                brandColor={store.branding.brand_color}
              />

              {/* Customer Form */}
              <CheckoutForm
                formData={formData}
                onFormChange={setFormData}
                shippingMethod={shippingMethod}
                brandColor={store.branding.brand_color}
              />
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OrderSummary
                  subtotal={subtotal}
                  shippingFee={shippingFee}
                  discountAmount={discountAmount}
                  total={total}
                  itemCount={itemCount}
                  brandColor={store.branding.brand_color}
                />

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: store.branding.brand_color }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    t('storefront.place_order_whatsapp')
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
