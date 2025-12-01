import Button from '@/components/Button'
import { ArrowTopRightOnSquareIcon, PlayCircleIcon } from '@heroicons/react/24/outline'

export default function DemoSection() {
  return (
    <section className="py-20 px-4 bg-white" id="demo">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="p-8 md:p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                See It In Action
              </h2>
              <p className="text-primary-100 text-lg mb-8 leading-relaxed">
                Explore our demo store to experience how easy it is for your customers to browse products and place orders. See the WhatsApp checkout flow in action.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-primary-50">Browse a real product catalog</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-primary-50">Add items to cart and test checkout</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-primary-50">See the WhatsApp integration</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href="https://demo.mywabiz.com" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto bg-white text-primary-600 hover:bg-primary-50 border-none"
                  >
                    <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-2" />
                    Open Demo Store
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto text-white border-2 border-primary-400 hover:bg-primary-600"
                >
                  <PlayCircleIcon className="w-5 h-5 mr-2" />
                  Watch Video
                </Button>
              </div>
            </div>

            {/* Screenshot/GIF Placeholder */}
            <div className="p-8 md:p-12 lg:p-8">
              <div className="bg-white rounded-2xl p-4 shadow-2xl">
                <div className="aspect-[9/16] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center p-6">
                    <PlayCircleIcon className="w-16 h-16 mx-auto text-primary-500 mb-4" />
                    <p className="text-gray-600 font-medium mb-2">Demo Store Preview</p>
                    <p className="text-sm text-gray-500">Interactive storefront screenshot or GIF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
