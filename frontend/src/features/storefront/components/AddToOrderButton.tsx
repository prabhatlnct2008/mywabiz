import { useTranslation } from 'react-i18next'
import Button from '@/components/Button'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

interface AddToOrderButtonProps {
  onClick: () => void
  isLoading?: boolean
  disabled?: boolean
  brandColor: string
}

export default function AddToOrderButton({
  onClick,
  isLoading,
  disabled,
  brandColor,
}: AddToOrderButtonProps) {
  const { t } = useTranslation()

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backgroundColor: brandColor }}
    >
      {isLoading ? (
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
      ) : (
        <>
          <ShoppingCartIcon className="w-5 h-5" />
          <span>{t('storefront.add_to_order')}</span>
        </>
      )}
    </button>
  )
}
