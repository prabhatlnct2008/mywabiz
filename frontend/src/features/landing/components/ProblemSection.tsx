import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const withoutMywabiz = [
  '"Price please?" for the same product again and again.',
  'Addresses hidden somewhere in old chats.',
  'No clear record of how many orders you actually got.',
]

const withMywabiz = [
  'Customers see all products and prices on one link.',
  'They fill their details once, in a short form.',
  'You receive one structured order message you can trust.',
]

export default function ProblemSection() {
  return (
    <section className="py-20 px-4 bg-white" id="problem">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-4">
            Tired of messy WhatsApp chats and half-written orders?
          </h2>
        </div>

        {/* Body Copy */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Your customers send random photos, old prices, and "What's the rate?" messages.
            You scroll through long chats to find sizes, colours, and addresses.
            Orders get confused. Deliveries get delayed. Everyone gets frustrated.
          </p>

          {/* Highlight */}
          <div className="bg-primary-50 border-l-4 border-primary-500 p-6 rounded-r-xl text-left">
            <p className="text-gray-800 font-medium text-lg">
              mywabiz turns that chaos into one clean, complete order message on WhatsApp – with all products, quantities, variants, and address in one place.
            </p>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Without mywabiz */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XCircleIcon className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Without mywabiz</h3>
            </div>
            <ul className="space-y-4">
              {withoutMywabiz.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <XCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With mywabiz */}
          <div className="bg-primary-50 rounded-2xl p-8 border border-primary-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">With mywabiz</h3>
            </div>
            <ul className="space-y-4">
              {withMywabiz.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
