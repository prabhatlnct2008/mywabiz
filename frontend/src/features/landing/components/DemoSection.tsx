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
                See mywabiz in action.
              </h2>
              <p className="text-primary-100 text-lg mb-8 leading-relaxed">
                Take a quick tour of how your future store looks and feels – from adding products to receiving a WhatsApp order.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href="https://demo.mywabiz.com" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto bg-white text-primary-600 hover:bg-primary-50 border-none"
                  >
                    <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-2" />
                    Open demo store
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

              {/* Supporting line */}
              <p className="text-primary-200 mt-6 text-sm">
                From Google Sheet to a fully formatted WhatsApp order in under a minute.
              </p>
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
