import { Link } from 'react-router-dom'
import Button from '@/components/Button'
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/outline'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Up to 50 products',
      'Basic storefront',
      'WhatsApp checkout',
      'Google Sheet integration',
      'Mobile-optimized',
      'Basic analytics',
      'mywabiz branding',
    ],
    cta: 'Start Free',
    popular: false,
    gradient: 'from-gray-500 to-gray-600',
  },
  {
    name: 'Growth',
    price: '₹299',
    period: 'per month',
    description: 'For growing businesses',
    features: [
      'Up to 500 products',
      'Everything in Starter',
      'Discount coupons',
      'Custom pages (About, Policies)',
      'Advanced analytics',
      'Email support',
      'Remove mywabiz branding',
    ],
    cta: 'Start 14-Day Free Trial',
    popular: true,
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    name: 'Pro',
    price: '₹699',
    period: 'per month',
    description: 'For established stores',
    features: [
      'Unlimited products',
      'Everything in Growth',
      'Advanced analytics & insights',
      'Custom domain support',
      'Priority WhatsApp support',
      'Bulk product import',
      'API access',
    ],
    cta: 'Start 14-Day Free Trial',
    popular: false,
    gradient: 'from-accent-500 to-accent-600',
  },
]

export default function PricingSection() {
  return (
    <section className="py-20 px-4 bg-gray-50" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free, upgrade when you're ready. All plans include WhatsApp checkout and Google Sheet integration.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105 md:scale-110 z-10' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                    <SparklesIcon className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 font-heading mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">/ {plan.period}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link to="/login" className="block mb-6">
                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className="w-full"
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>

                {/* Features */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900 mb-4">What's included:</p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center mt-0.5`}>
                        <CheckIcon className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            All paid plans come with a 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-gray-500">
            Need a custom plan for your enterprise? <a href="mailto:hello@mywabiz.com" className="text-primary-600 hover:underline font-medium">Contact us</a>
          </p>
        </div>
      </div>
    </section>
  )
}
