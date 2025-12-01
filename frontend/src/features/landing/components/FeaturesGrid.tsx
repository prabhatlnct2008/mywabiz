import {
  ChatBubbleLeftRightIcon,
  TableCellsIcon,
  DevicePhoneMobileIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    title: 'WhatsApp-First Checkout',
    description: 'Customers complete their purchase directly in WhatsApp - no app downloads, no new accounts, no friction.',
    icon: ChatBubbleLeftRightIcon,
    highlight: false,
  },
  {
    title: 'Google Sheet Catalog',
    description: 'Update products, prices, and stock in real-time using a simple Google Sheet. No complex backend needed.',
    icon: TableCellsIcon,
    highlight: false,
  },
  {
    title: 'Mobile-Ready Storefront',
    description: 'Beautiful, fast-loading store that works perfectly on any phone. Share one link, reach all customers.',
    icon: DevicePhoneMobileIcon,
    highlight: false,
  },
  {
    title: 'Basic Analytics',
    description: 'Track views, popular products, and order patterns to understand what your customers want.',
    icon: ChartBarIcon,
    highlight: false,
  },
]

const premiumFeatures = [
  'Advanced analytics & insights',
  'Custom discount coupons',
  'Custom pages (About, Policies)',
  'Priority support',
  'Remove mywabiz branding',
]

export default function FeaturesGrid() {
  return (
    <section className="py-20 px-4 bg-gray-50" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-4">
            Everything You Need to Start Selling
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed specifically for WhatsApp-based businesses.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 font-heading">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Features Callout */}
        <div className="relative bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-8 md:p-10 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <SparklesIcon className="w-8 h-8" />
              <h3 className="text-2xl md:text-3xl font-bold font-heading">
                Unlock Premium Features
              </h3>
            </div>
            <p className="text-accent-100 mb-6 text-lg max-w-2xl">
              Take your store to the next level with our Growth and Pro plans
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {premiumFeatures.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 animate-fade-in"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
