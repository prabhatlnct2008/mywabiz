import { Link } from 'react-router-dom'
import Button from '@/components/Button'
import { CheckIcon } from '@heroicons/react/24/outline'

const benefits = [
  'Free plan to get started and test.',
  'Affordable paid plan when you\'re getting regular orders.',
  'Cancel any time. No lock-in.',
]

export default function PricingSection() {
  return (
    <section className="py-20 px-4 bg-gray-50" id="pricing">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-4">
            Start free. Upgrade only when your orders grow.
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your store, add products, and share your link for free.
            When you're ready for coupons, custom pages, and more control over branding, upgrade to a simple monthly plan.
          </p>
        </div>

        {/* Benefits List */}
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-lg mb-8">
          <div className="max-w-xl mx-auto">
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center mt-0.5">
                    <CheckIcon className="w-4 h-4 text-white stroke-[3]" />
                  </div>
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <Link to="/pricing">
                <Button size="lg" variant="secondary">
                  See full pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Price Comparison */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Starter</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">Free</p>
            <p className="text-sm text-gray-500">forever</p>
          </div>
          <div className="bg-primary-50 rounded-xl p-6 border-2 border-primary-500 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-3 py-0.5 rounded-full text-xs font-semibold">
              Popular
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Growth</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">₹299</p>
            <p className="text-sm text-gray-500">per month</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Pro</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">₹699</p>
            <p className="text-sm text-gray-500">per month</p>
          </div>
        </div>
      </div>
    </section>
  )
}
