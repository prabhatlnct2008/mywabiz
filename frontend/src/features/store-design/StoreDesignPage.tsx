import { useStore } from '@/hooks/useStore'
import { useStoreDesign } from './useStoreDesign'
import BrandingControls from './BrandingControls'
import SectionToggles from './SectionToggles'
import ThemeSelector from './ThemeSelector'
import LanguageSelector from './LanguageSelector'
import LivePreview from './LivePreview'

export default function StoreDesignPage() {
  const { store, isLoading: storeLoading, refreshStore } = useStore()
  const {
    isSaving,
    previewMode,
    setPreviewMode,
    updateBranding,
    updateSections,
    updateTheme,
    updateLanguage,
  } = useStoreDesign(store)

  if (storeLoading) {
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

  const handleBrandingUpdate = async (branding: any) => {
    await updateBranding(branding)
    await refreshStore()
  }

  const handleSectionsUpdate = async (sections: any) => {
    await updateSections(sections)
    await refreshStore()
  }

  const handleThemeUpdate = async (theme: any) => {
    await updateTheme(theme)
    await refreshStore()
  }

  const handleLanguageUpdate = async (language: any) => {
    await updateLanguage(language)
    await refreshStore()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 font-heading mb-6">
        Store Design
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          <BrandingControls
            store={store}
            onUpdate={handleBrandingUpdate}
            isSaving={isSaving}
          />

          <ThemeSelector
            store={store}
            onUpdate={handleThemeUpdate}
            isSaving={isSaving}
          />

          <SectionToggles
            store={store}
            onUpdate={handleSectionsUpdate}
            isSaving={isSaving}
          />

          <LanguageSelector
            store={store}
            onUpdate={handleLanguageUpdate}
            isSaving={isSaving}
          />
        </div>

        {/* Right Column - Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <LivePreview
            store={store}
            previewMode={previewMode}
            onPreviewModeChange={setPreviewMode}
          />
        </div>
      </div>
    </div>
  )
}
