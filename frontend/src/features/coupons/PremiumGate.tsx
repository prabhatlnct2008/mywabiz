import Card from '@/components/Card'
import Button from '@/components/Button'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

interface PremiumGateProps {
  feature: string
}

export default function PremiumGate({ feature }: PremiumGateProps) {
  const navigate = useNavigate()

  return (
    <Card className="text-center py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
          <SparklesIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
          {feature} is a Premium Feature
        </h2>
        <p className="text-gray-600 mb-6">
          Upgrade to Growth or Pro plan to unlock {feature.toLowerCase()} and other advanced features for your store.
        </p>
        <Button onClick={() => navigate('/upgrade')} variant="primary">
          Upgrade Now
        </Button>
      </div>
    </Card>
  )
}
