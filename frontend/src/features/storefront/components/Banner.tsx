import { PublicStore } from '@/types/public'

interface BannerProps {
  store: PublicStore
}

export default function Banner({ store }: BannerProps) {
  const { branding, sections } = store

  if (!sections.banner || !branding.banner_url) {
    return null
  }

  return (
    <div className="relative w-full h-48 sm:h-64 md:h-80 overflow-hidden bg-gray-100">
      <img
        src={branding.banner_url}
        alt={branding.banner_text || 'Store banner'}
        className="w-full h-full object-cover"
      />
      {branding.banner_text && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-heading">
              {branding.banner_text}
            </h2>
          </div>
        </div>
      )}
    </div>
  )
}
