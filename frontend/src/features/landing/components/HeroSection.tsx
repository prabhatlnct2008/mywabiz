import { Link } from 'react-router-dom'
import Button from '@/components/Button'
import { DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

export default function HeroSection() {
  return (
    <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 font-heading mb-6 leading-tight">
              Turn your WhatsApp into a proper store in{' '}
              <span className="text-primary-500">10 minutes</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              mywabiz lets Delhi shops sell with a simple link, Google Sheet catalog, and WhatsApp checkout. No app, no coding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Create your free store
                </Button>
              </Link>
              <a href="#demo">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  View demo
                </Button>
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Free forever · No credit card required · Setup in minutes
            </p>
          </div>

          {/* Phone Mockup Placeholder */}
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
                <span className="text-sm font-semibold">Free Setup!</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary-500 text-white px-4 py-2 rounded-full shadow-lg animate-float-delayed">
                <span className="text-sm font-semibold">WhatsApp First</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
