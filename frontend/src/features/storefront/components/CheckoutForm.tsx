import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Input from '@/components/Input'
import { ShippingMethod } from '@/types/order'

interface CheckoutFormData {
  name: string
  phone: string
  email: string
  address: string
}

interface CheckoutFormProps {
  formData: CheckoutFormData
  onFormChange: (data: CheckoutFormData) => void
  shippingMethod: ShippingMethod
  brandColor: string
}

export default function CheckoutForm({
  formData,
  onFormChange,
  shippingMethod,
  brandColor,
}: CheckoutFormProps) {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({})

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    onFormChange({ ...formData, [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  const validatePhone = (phone: string) => {
    // Basic phone validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const validateEmail = (email: string) => {
    if (!email) return true // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Customer Information
      </h2>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          {t('storefront.name')} <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter your name"
          className={errors.name ? 'border-red-500' : ''}
          required
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          {t('storefront.phone')} <span className="text-red-500">*</span>
        </label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="9876543210"
          className={errors.phone ? 'border-red-500' : ''}
          required
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t('storefront.email')}
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="your@email.com (optional)"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Address (required for delivery) */}
      {shippingMethod === 'delivery' && (
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            {t('storefront.address')} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Enter your delivery address"
            rows={3}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            style={{
              focusRing: brandColor,
            }}
            required
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
      )}
    </div>
  )
}
