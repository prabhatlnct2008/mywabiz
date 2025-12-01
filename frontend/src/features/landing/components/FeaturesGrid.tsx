import {
  ChatBubbleLeftRightIcon,
  TableCellsIcon,
  DevicePhoneMobileIcon,
  LanguageIcon,
  ChartBarIcon,
  TicketIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    title: 'WhatsApp-first checkout',
    description: 'Customers confirm orders through WhatsApp. You get one clearly formatted message with items, quantities, variants, address, and total.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    title: 'Google Sheet or in-app catalog',
    description: 'Add and update products faster than any app. Use the auto-generated Google Sheet or manage everything inside the mywabiz dashboard.',
    icon: TableCellsIcon,
  },
  {
    title: 'Clean, mobile-ready storefront',
    description: 'Your store link opens a modern, clutter-free catalog that works on any smartphone browser.',
    icon: DevicePhoneMobileIcon,
  },
  {
    title: 'Multi-language store experience',
    description: 'Choose how your store speaks to customers. Show buttons, labels, and system messages in English, Hindi, Punjabi, Gujarati, or Haryanvi. Products stay exactly as you write them.',
    icon: LanguageIcon,
  },
  {
    title: 'Basic analytics',
    description: 'See total orders, sales, and visits at a glance, so you know what\'s working.',
    icon: ChartBarIcon,
  },
  {
    title: 'Coupons & custom pages (Premium)',
    description: 'Run discounts with coupon codes, and add pages like "About" or "Size guide" to look more professional and build trust.',
    icon: TicketIcon,
  },
]

export default function FeaturesGrid() {
  return (
    <section className="py-20 px-4 bg-gray-50" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-4">
            Everything you need to sell confidently on WhatsApp.
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed specifically for WhatsApp-based businesses.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col h-full">
                <div className="flex-shrink-0 mb-4">
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
      </div>
    </section>
  )
}
