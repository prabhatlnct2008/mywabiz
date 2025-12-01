import Card from '@/components/Card'
import Button from '@/components/Button'
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface PricingPlan {
  name: string
  price: number
  period: 'month' | 'year'
  description: string
  features: string[]
  recommended?: boolean
  current?: boolean
}

interface PricingCardProps {
  plan: PricingPlan
  onSelect: () => void
}

export default function PricingCard({ plan, onSelect }: PricingCardProps) {
  return (
    <Card
      className={`relative ${
        plan.recommended
          ? 'border-2 border-primary-500 shadow-xl'
          : 'border border-gray-200'
      }`}
    >
      {plan.recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="inline-flex items-center gap-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            <SparklesIcon className="h-4 w-4" />
            Recommended
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
          {plan.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
          <span className="text-gray-500">/{plan.period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckIcon className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onSelect}
        variant={plan.recommended ? 'primary' : 'secondary'}
        className="w-full"
        disabled={plan.current}
      >
        {plan.current ? 'Current Plan' : 'Select Plan'}
      </Button>
    </Card>
  )
}
