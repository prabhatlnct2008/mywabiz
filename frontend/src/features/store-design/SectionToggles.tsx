import { Store } from '@/types/store'
import Card from '@/components/Card'

interface SectionTogglesProps {
  store: Store
  onUpdate: (sections: Partial<Store['sections']>) => Promise<void>
  isSaving: boolean
}

export default function SectionToggles({
  store,
  onUpdate,
  isSaving,
}: SectionTogglesProps) {
  const sections = [
    {
      key: 'header' as const,
      label: 'Header',
      description: 'Store name and logo',
    },
    {
      key: 'banner' as const,
      label: 'Banner',
      description: 'Promotional banner section',
    },
    {
      key: 'products' as const,
      label: 'Products',
      description: 'Product catalog display',
    },
    {
      key: 'footer' as const,
      label: 'Footer',
      description: 'Store info and links',
    },
  ]

  const handleToggle = async (key: keyof Store['sections']) => {
    await onUpdate({
      [key]: !store.sections[key],
    })
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Store Sections
      </h3>

      <div className="space-y-3">
        {sections.map((section) => (
          <div
            key={section.key}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div>
              <p className="font-medium text-gray-900">{section.label}</p>
              <p className="text-sm text-gray-500">{section.description}</p>
            </div>

            <button
              onClick={() => handleToggle(section.key)}
              disabled={isSaving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 ${
                store.sections[section.key]
                  ? 'bg-primary-500'
                  : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  store.sections[section.key]
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </Card>
  )
}
