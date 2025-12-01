import { PublicStore } from '@/types/public'
import { clsx } from 'clsx'

interface HeaderProps {
  store: PublicStore
}

export default function Header({ store }: HeaderProps) {
  const { branding, name } = store

  return (
    <header
      className="sticky top-0 z-50 bg-white shadow-sm"
      style={{
        borderBottom: `2px solid ${branding.brand_color}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {branding.logo_url ? (
              <img
                src={branding.logo_url}
                alt={name}
                className="h-10 w-10 object-contain rounded-lg"
              />
            ) : (
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: branding.brand_color }}
              >
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-xl font-bold text-gray-900 font-heading">
              {name}
            </h1>
          </div>
        </div>
      </div>
    </header>
  )
}
