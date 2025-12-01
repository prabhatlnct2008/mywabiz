import { Link } from 'react-router-dom'
import Button from '@/components/Button'
import { DevicePhoneMobileIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const keyBullets = [
  'Share a single store link instead of dozens of product photos.',
  'Add and update products in Google Sheets or inside mywabiz.',
  'Store UI and order messages that support English, हिंदी (Hindi), ਪੰਜਾਬੀ (Punjabi), ગુજરાતી (Gujarati), and हरियाणवी (Haryanvi).',
]

export default function HeroSection() {
  return (
    <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 font-heading mb-6 leading-tight">
              Turn your WhatsApp into a real online store in{' '}
              <span className="text-primary-500">10 minutes</span>.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto lg:mx-0">
              Create a clean product page, manage stock in a simple sheet, and receive clear, structured orders directly on WhatsApp – without coding or new apps.
            </p>

            {/* Key Bullets */}
            <ul className="space-y-3 mb-8 max-w-2xl mx-auto lg:mx-0">
              {keyBullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-3 text-left">
                  <CheckCircleIcon className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Create your free WhatsApp store
                </Button>
              </Link>
              <a href="#demo">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  View demo store
                </Button>
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Takes under 10 minutes. No credit card needed.
            </p>

            {/* Microcopy */}
            <div className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100 max-w-2xl mx-auto lg:mx-0">
              <p className="text-gray-700 text-sm">
                Your customers keep using WhatsApp. You get a proper storefront, a simple link, and perfectly formatted orders – in their language.
              </p>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative lg:order-2 animate-slide-in-right">
            <div className="relative mx-auto max-w-md">
              {/* Phone Frame */}
              <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-4 shadow-inner">
                  <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <DevicePhoneMobileIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 font-medium">Store Preview</p>
                      <p className="text-sm text-gray-400 mt-2">Mobile storefront mockup</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-accent-500 text-white px-4 py-2 rounded-full shadow-lg animate-float">
                <span className="text-sm font-semibold">10 Min Setup!</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary-500 text-white px-4 py-2 rounded-full shadow-lg animate-float-delayed">
                <span className="text-sm font-semibold">5 Languages</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="mt-20 text-center border-t border-gray-200 pt-12">
          <p className="text-lg font-semibold text-gray-800 mb-2">
            Made for small businesses that already sell on WhatsApp every day.
          </p>
          <p className="text-gray-600">
            Boutiques, grocery shops, home chefs, wholesalers, resellers, and more.
          </p>
        </div>
      </div>
    </section>
  )
}
