import { useState } from 'react'
import { Store } from '@/types/store'
import Card from '@/components/Card'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { PhotoIcon } from '@heroicons/react/24/outline'

interface BrandingControlsProps {
  store: Store
  onUpdate: (branding: Partial<Store['branding']>) => Promise<void>
  isSaving: boolean
}

export default function BrandingControls({
  store,
  onUpdate,
  isSaving,
}: BrandingControlsProps) {
  const [logoUrl, setLogoUrl] = useState(store.branding.logo_url || '')
  const [brandColor, setBrandColor] = useState(store.branding.brand_color)
  const [bannerUrl, setBannerUrl] = useState(store.branding.banner_url || '')
  const [bannerText, setBannerText] = useState(store.branding.banner_text || '')

  const handleSave = async () => {
    await onUpdate({
      logo_url: logoUrl || undefined,
      brand_color: brandColor,
      banner_url: bannerUrl || undefined,
      banner_text: bannerText || undefined,
    })
  }

  const hasChanges =
    logoUrl !== (store.branding.logo_url || '') ||
    brandColor !== store.branding.brand_color ||
    bannerUrl !== (store.branding.banner_url || '') ||
    bannerText !== (store.branding.banner_text || '')

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Branding</h3>

      <div className="space-y-4">
        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Logo
          </label>
          <div className="flex gap-3">
            {logoUrl && (
              <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                helperText="Enter image URL or upload"
              />
            </div>
          </div>
        </div>

        {/* Brand Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Color
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
            />
            <Input
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>

        {/* Banner */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Image
          </label>
          {bannerUrl && (
            <div className="w-full h-32 rounded-lg border border-gray-200 overflow-hidden mb-2">
              <img
                src={bannerUrl}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <Input
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="https://example.com/banner.jpg"
            helperText="Optional banner image"
          />
        </div>

        {/* Banner Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Text
          </label>
          <Input
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            placeholder="e.g., Free shipping on orders over ₹999"
            helperText="Text to display on banner"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          isLoading={isSaving}
          className="w-full"
        >
          Save Branding
        </Button>
      </div>
    </Card>
  )
}
