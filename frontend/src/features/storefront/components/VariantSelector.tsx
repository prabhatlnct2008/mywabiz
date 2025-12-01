import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'

interface VariantSelectorProps {
  sizes: string[]
  colors: string[]
  selectedSize: string | null
  selectedColor: string | null
  onSelectSize: (size: string) => void
  onSelectColor: (color: string) => void
  brandColor: string
}

export default function VariantSelector({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  onSelectSize,
  onSelectColor,
  brandColor,
}: VariantSelectorProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {/* Size Selector */}
      {sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('storefront.size')}
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSelectSize(size)}
                className={clsx(
                  'px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all',
                  selectedSize === size
                    ? 'border-current text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                )}
                style={
                  selectedSize === size
                    ? { backgroundColor: brandColor, borderColor: brandColor }
                    : undefined
                }
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('storefront.color')}
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onSelectColor(color)}
                className={clsx(
                  'px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all',
                  selectedColor === color
                    ? 'border-current text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                )}
                style={
                  selectedColor === color
                    ? { backgroundColor: brandColor, borderColor: brandColor }
                    : undefined
                }
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
