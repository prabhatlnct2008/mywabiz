import { Store } from '@/types/store'
import Card from '@/components/Card'
import { ComputerDesktopIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

interface LivePreviewProps {
  store: Store
  previewMode: 'desktop' | 'mobile'
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void
}

export default function LivePreview({
  store,
  previewMode,
  onPreviewModeChange,
}: LivePreviewProps) {
  const previewUrl = `/store/${store.slug}`

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>

        <div className="flex gap-2">
          <button
            onClick={() => onPreviewModeChange('desktop')}
            className={`p-2 rounded-lg transition-colors ${
              previewMode === 'desktop'
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Desktop view"
          >
            <ComputerDesktopIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onPreviewModeChange('mobile')}
            className={`p-2 rounded-lg transition-colors ${
              previewMode === 'mobile'
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Mobile view"
          >
            <DevicePhoneMobileIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[600px]">
        <div
          className={`bg-white rounded-lg shadow-xl overflow-hidden transition-all ${
            previewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-4xl'
          }`}
        >
          <iframe
            src={previewUrl}
            className={`w-full border-0 ${
              previewMode === 'mobile' ? 'h-[667px]' : 'h-[800px]'
            }`}
            title="Store Preview"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Open in new tab →
        </a>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Refresh preview
        </button>
      </div>
    </Card>
  )
}
