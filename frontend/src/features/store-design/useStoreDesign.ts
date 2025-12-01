import { useState, useEffect } from 'react'
import { storesApi } from '@/api/stores'
import { Store, StoreUpdate, Theme, Language } from '@/types/store'
import toast from 'react-hot-toast'

export function useStoreDesign(store: Store | null) {
  const [isSaving, setIsSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')

  const updateBranding = async (branding: Partial<Store['branding']>) => {
    if (!store) return

    setIsSaving(true)
    try {
      await storesApi.update(store.id, { branding })
      toast.success('Branding updated')
    } catch (error) {
      toast.error('Failed to update branding')
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const updateSections = async (sections: Partial<Store['sections']>) => {
    if (!store) return

    setIsSaving(true)
    try {
      await storesApi.update(store.id, { sections })
      toast.success('Sections updated')
    } catch (error) {
      toast.error('Failed to update sections')
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const updateTheme = async (theme: Theme) => {
    if (!store) return

    setIsSaving(true)
    try {
      await storesApi.update(store.id, { theme })
      toast.success('Theme updated')
    } catch (error) {
      toast.error('Failed to update theme')
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const updateLanguage = async (language: Language) => {
    if (!store) return

    setIsSaving(true)
    try {
      await storesApi.update(store.id, { language })
      toast.success('Language updated')
    } catch (error) {
      toast.error('Failed to update language')
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  return {
    isSaving,
    previewMode,
    setPreviewMode,
    updateBranding,
    updateSections,
    updateTheme,
    updateLanguage,
  }
}
