import { useState, useEffect } from 'react'
import { useStore } from '@/hooks/useStore'
import { storesApi } from '@/api/stores'
import { Language } from '@/types/store'
import Card from '@/components/Card'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/Button'
import toast from 'react-hot-toast'

const languages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी (Hindi)' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { value: 'hr', label: 'हरियाणवी (Haryanvi)' },
  { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
]

export default function SettingsPage() {
  const { store, isLoading, refreshStore } = useStore()

  // Store details state
  const [storeName, setStoreName] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [language, setLanguage] = useState<Language>('en')
  const [isSavingDetails, setIsSavingDetails] = useState(false)

  // Shipping state
  const [pickupEnabled, setPickupEnabled] = useState(false)
  const [pickupAddress, setPickupAddress] = useState('')
  const [deliveryEnabled, setDeliveryEnabled] = useState(false)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [isSavingShipping, setIsSavingShipping] = useState(false)

  // Payment state
  const [codEnabled, setCodEnabled] = useState(true)
  const [paypalEnabled, setPaypalEnabled] = useState(false)
  const [paypalClientId, setPaypalClientId] = useState('')
  const [isSavingPayment, setIsSavingPayment] = useState(false)

  useEffect(() => {
    if (store) {
      setStoreName(store.name)
      setWhatsappNumber(store.whatsapp_number)
      setLanguage(store.language)
      setPickupEnabled(store.shipping.pickup_enabled)
      setPickupAddress(store.shipping.pickup_address || '')
      setDeliveryEnabled(store.shipping.delivery_enabled)
      setDeliveryFee(store.shipping.delivery_fee)
      setCodEnabled(store.payments.cod_enabled)
      setPaypalEnabled(store.payments.paypal_enabled)
      setPaypalClientId(store.payments.paypal_client_id || '')
    }
  }, [store])

  const handleSaveDetails = async () => {
    if (!store) return

    setIsSavingDetails(true)
    try {
      await storesApi.update(store.id, {
        name: storeName,
        whatsapp_number: whatsappNumber,
        language,
      })
      toast.success('Store details updated')
      await refreshStore()
    } catch (error) {
      toast.error('Failed to update store details')
    } finally {
      setIsSavingDetails(false)
    }
  }

  const handleSaveShipping = async () => {
    if (!store) return

    setIsSavingShipping(true)
    try {
      await storesApi.update(store.id, {
        shipping: {
          pickup_enabled: pickupEnabled,
          pickup_address: pickupAddress,
          delivery_enabled: deliveryEnabled,
          delivery_fee: deliveryFee,
        },
      })
      toast.success('Shipping settings updated')
      await refreshStore()
    } catch (error) {
      toast.error('Failed to update shipping settings')
    } finally {
      setIsSavingShipping(false)
    }
  }

  const handleSavePayment = async () => {
    if (!store) return

    setIsSavingPayment(true)
    try {
      await storesApi.update(store.id, {
        payments: {
          cod_enabled: codEnabled,
          paypal_enabled: paypalEnabled,
          paypal_client_id: paypalClientId,
        },
      })
      toast.success('Payment settings updated')
      await refreshStore()
    } catch (error) {
      toast.error('Failed to update payment settings')
    } finally {
      setIsSavingPayment(false)
    }
  }

  const handleDeleteStore = async () => {
    if (!store) return

    const confirmed = window.confirm(
      'Are you sure you want to delete your store? This action cannot be undone.'
    )

    if (confirmed) {
      try {
        await storesApi.delete(store.id)
        toast.success('Store deleted')
        window.location.href = '/onboarding'
      } catch (error) {
        toast.error('Failed to delete store')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No store found. Please create a store first.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 font-heading mb-6">
        Settings
      </h1>

      <div className="space-y-6">
        {/* Store Details */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Store Details
          </h2>
          <div className="space-y-4 max-w-md">
            <Input
              label="Store name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="My Store"
            />
            <Input
              label="WhatsApp number"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="919876543210"
              helperText="Include country code (e.g., 91 for India)"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store URL
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={`${window.location.origin}/store/${store.slug}`}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/store/${store.slug}`
                    )
                    toast.success('URL copied to clipboard')
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
            <Select
              label="Store language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              options={languages}
            />
            <Button onClick={handleSaveDetails} isLoading={isSavingDetails}>
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Shipping */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Shipping
          </h2>
          <div className="space-y-4 max-w-md">
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div>
                <span className="font-medium text-gray-900">Enable Pickup</span>
                <p className="text-sm text-gray-500">Customers can pick up orders</p>
              </div>
              <button
                onClick={() => setPickupEnabled(!pickupEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  pickupEnabled ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    pickupEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {pickupEnabled && (
              <Input
                label="Pickup address"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Enter pickup location"
              />
            )}

            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div>
                <span className="font-medium text-gray-900">Enable Delivery</span>
                <p className="text-sm text-gray-500">Ship orders to customers</p>
              </div>
              <button
                onClick={() => setDeliveryEnabled(!deliveryEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  deliveryEnabled ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    deliveryEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {deliveryEnabled && (
              <Input
                label="Delivery fee (₹)"
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseFloat(e.target.value))}
                placeholder="0"
              />
            )}

            <Button onClick={handleSaveShipping} isLoading={isSavingShipping}>
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Payment */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Methods
          </h2>
          <div className="space-y-4 max-w-md">
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div>
                <span className="font-medium text-gray-900">Cash on Delivery</span>
                <p className="text-sm text-gray-500">Accept cash payments</p>
              </div>
              <button
                onClick={() => setCodEnabled(!codEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  codEnabled ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    codEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div>
                <span className="font-medium text-gray-900">PayPal</span>
                <p className="text-sm text-gray-500">Accept PayPal payments</p>
              </div>
              <button
                onClick={() => setPaypalEnabled(!paypalEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  paypalEnabled ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    paypalEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {paypalEnabled && (
              <Input
                label="PayPal Client ID"
                value={paypalClientId}
                onChange={(e) => setPaypalClientId(e.target.value)}
                placeholder="Enter your PayPal Client ID"
                helperText="Get this from your PayPal developer dashboard"
              />
            )}

            <Button onClick={handleSavePayment} isLoading={isSavingPayment}>
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <h2 className="text-lg font-semibold text-red-600 mb-4">
            Danger Zone
          </h2>
          <p className="text-gray-600 mb-4">
            Once you delete your store, there is no going back. Please be certain.
          </p>
          <Button variant="danger" onClick={handleDeleteStore}>
            Delete Store
          </Button>
        </Card>
      </div>
    </div>
  )
}
