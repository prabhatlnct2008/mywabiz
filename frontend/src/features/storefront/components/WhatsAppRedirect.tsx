import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/Button'
import { CheckCircleIcon, ClipboardDocumentIcon } from '@heroicons/react/24/solid'

interface WhatsAppRedirectProps {
  whatsappUrl: string
  orderNumber: string
  brandColor: string
}

export default function WhatsAppRedirect({
  whatsappUrl,
  orderNumber,
  brandColor,
}: WhatsAppRedirectProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [redirecting, setRedirecting] = useState(true)

  useEffect(() => {
    // Attempt to open WhatsApp
    const timer = setTimeout(() => {
      window.location.href = whatsappUrl
      setRedirecting(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [whatsappUrl])

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(whatsappUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleOpenWhatsApp = () => {
    window.location.href = whatsappUrl
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: `${brandColor}20` }}
        >
          <CheckCircleIcon
            className="w-10 h-10"
            style={{ color: brandColor }}
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
          {t('storefront.order_placed')}
        </h1>

        {/* Order Number */}
        <p className="text-gray-600 mb-6">
          Order #{orderNumber}
        </p>

        {/* Redirecting Message */}
        {redirecting ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                style={{ color: brandColor }}
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
              <span className="text-gray-600">Opening WhatsApp...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Message */}
            <p className="text-gray-600">
              Complete your order by sending the message on WhatsApp
            </p>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleOpenWhatsApp}
                className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: brandColor }}
              >
                {t('storefront.place_order_whatsapp')}
              </button>

              <button
                onClick={handleCopyUrl}
                className="w-full py-3 px-6 rounded-xl font-semibold border-2 transition-all duration-200 hover:bg-gray-50 flex items-center justify-center gap-2"
                style={{
                  borderColor: brandColor,
                  color: brandColor,
                }}
              >
                <ClipboardDocumentIcon className="w-5 h-5" />
                {copied ? 'Copied!' : 'Copy WhatsApp Link'}
              </button>
            </div>

            {/* Helper Text */}
            <p className="text-sm text-gray-500 pt-4">
              If WhatsApp doesn't open automatically, click the button above or
              copy the link.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
