import { PublicStore } from '@/types/public'

interface FooterProps {
  store: PublicStore
}

export default function Footer({ store }: FooterProps) {
  if (!store.sections.footer) {
    return null
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center space-y-2">
          <p className="text-gray-600 font-medium">{store.name}</p>
          {store.whatsapp_number && (
            <p className="text-sm text-gray-500">
              WhatsApp: {store.whatsapp_number}
            </p>
          )}
          <div className="pt-4 border-t border-gray-200 mt-4">
            <p className="text-xs text-gray-400">
              Powered by{' '}
              <a
                href="https://mywabiz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-gray-600 transition-colors"
                style={{ color: store.branding.brand_color }}
              >
                mywabiz
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
