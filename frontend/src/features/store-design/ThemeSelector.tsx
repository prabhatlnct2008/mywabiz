import { Store, Theme } from '@/types/store'
import Card from '@/components/Card'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface ThemeSelectorProps {
  store: Store
  onUpdate: (theme: Theme) => Promise<void>
  isSaving: boolean
}

const themes: Array<{
  id: Theme
  name: string
  description: string
  preview: string
}> = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design',
    preview: 'bg-white border-2 border-gray-200',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Vibrant and eye-catching',
    preview: 'bg-gradient-to-br from-primary-500 to-purple-600',
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Modern dark theme',
    preview: 'bg-gray-900 border-2 border-gray-700',
  },
]

export default function ThemeSelector({
  store,
  onUpdate,
  isSaving,
}: ThemeSelectorProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>

      <div className="grid grid-cols-3 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onUpdate(theme.id)}
            disabled={isSaving}
            className={`relative p-4 rounded-xl border-2 transition-all text-left disabled:opacity-50 ${
              store.theme === theme.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Preview */}
            <div
              className={`w-full h-24 rounded-lg mb-3 ${theme.preview}`}
            />

            {/* Info */}
            <div className="relative">
              <p className="font-semibold text-gray-900 mb-1">{theme.name}</p>
              <p className="text-xs text-gray-500">{theme.description}</p>

              {/* Selected indicator */}
              {store.theme === theme.id && (
                <CheckCircleIcon className="absolute -top-1 right-0 h-5 w-5 text-primary-500" />
              )}
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}
