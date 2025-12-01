import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PricingCard from './PricingCard'
import Modal from '@/components/Modal'
import PayPalButton from './PayPalButton'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    period: 'month' as const,
    description: 'Perfect for getting started',
    features: [
      'Up to 50 products',
      'WhatsApp integration',
      'Basic analytics',
      'Google Sheets sync',
      'Multi-language support',
      'Custom branding',
    ],
    current: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 499,
    period: 'month' as const,
    description: 'For growing businesses',
    features: [
      'Up to 500 products',
      'Everything in Starter',
      'Discount coupons',
      'Custom pages',
      'Remove "Powered by" branding',
      'Priority support',
      'Advanced analytics',
    ],
    recommended: true,
    current: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 999,
    period: 'month' as const,
    description: 'For established stores',
    features: [
      'Unlimited products',
      'Everything in Growth',
      'API access',
      'Custom domain',
      'Dedicated account manager',
      'White-label solution',
      'Custom integrations',
      'SLA guarantee',
    ],
    current: false,
  },
]

export default function UpgradePage() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  const handleSelectPlan = (planId: string) => {
    if (planId === 'starter') {
      alert('You are already on the Starter plan!')
      return
    }
    setSelectedPlan(planId)
    setShowPayment(true)
  }

  const handlePaymentSuccess = (details: any) => {
    console.log('Payment successful:', details)
    setShowPayment(false)
    alert('Payment successful! Your plan has been upgraded.')
    // TODO: Update store plan in backend
    navigate('/dashboard')
  }

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error)
    alert('Payment failed. Please try again.')
  }

  const selectedPlanDetails = plans.find((p) => p.id === selectedPlan)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600">
          Select the perfect plan for your business needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onSelect={() => handleSelectPlan(plan.id)}
          />
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
          Need a custom plan?
        </h2>
        <p className="text-gray-600 mb-6">
          Contact us for enterprise solutions with custom features and pricing
        </p>
        <a
          href="mailto:enterprise@mywabiz.in"
          className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Contact Sales
        </a>
      </div>

      <Modal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        title={`Upgrade to ${selectedPlanDetails?.name}`}
      >
        {selectedPlanDetails && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-900">
                  {selectedPlanDetails.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{selectedPlanDetails.price}/{selectedPlanDetails.period}
                </span>
              </div>
            </div>

            <PayPalButton
              planId={selectedPlanDetails.id}
              amount={selectedPlanDetails.price}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}
