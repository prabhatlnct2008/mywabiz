import { Store, Language } from '@/types/store'
import Card from '@/components/Card'
import Select from '@/components/Select'

interface LanguageSelectorProps {
  store: Store
  onUpdate: (language: Language) => Promise<void>
  isSaving: boolean
}

const languages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी (Hindi)' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { value: 'hr', label: 'हरियाणवी (Haryanvi)' },
  { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
]

export default function LanguageSelector({
  store,
  onUpdate,
  isSaving,
}: LanguageSelectorProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Store Language
      </h3>

      <Select
        label="Language"
        value={store.language}
        onChange={(e) => onUpdate(e.target.value as Language)}
        options={languages}
        disabled={isSaving}
      />

      <p className="mt-3 text-sm text-gray-500">
        All store text will be displayed in the selected language
      </p>
    </Card>
  )
}
