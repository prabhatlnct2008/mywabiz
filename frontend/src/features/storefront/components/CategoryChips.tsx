import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import { PublicStore } from '@/types/public'

interface CategoryChipsProps {
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  store: PublicStore
}

export default function CategoryChips({
  categories,
  selectedCategory,
  onSelectCategory,
  store,
}: CategoryChipsProps) {
  const { t } = useTranslation()

  if (categories.length === 0) {
    return null
  }

  const brandColor = store.branding.brand_color

  return (
    <div className="sticky top-[73px] z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
          <button
            onClick={() => onSelectCategory(null)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
              selectedCategory === null
                ? 'text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
            style={
              selectedCategory === null
                ? { backgroundColor: brandColor }
                : undefined
            }
          >
            {t('common.all')}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
                selectedCategory === category
                  ? 'text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
              style={
                selectedCategory === category
                  ? { backgroundColor: brandColor }
                  : undefined
              }
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
