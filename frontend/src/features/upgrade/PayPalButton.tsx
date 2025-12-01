import { useState } from 'react'
import Button from '@/components/Button'

interface PayPalButtonProps {
  planId: string
  amount: number
  onSuccess: (details: any) => void
  onError?: (error: any) => void
}

export default function PayPalButton({
  planId,
  amount,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    try {
      // TODO: Implement PayPal integration
      // This is a placeholder for the PayPal payment flow
      console.log('Processing payment for plan:', planId, 'Amount:', amount)

      // Simulate payment success after 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000))

      onSuccess({
        planId,
        amount,
        transactionId: 'MOCK_' + Date.now(),
      })
    } catch (error) {
      console.error('Payment error:', error)
      if (onError) {
        onError(error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> PayPal integration is coming soon. This is a placeholder
          for the payment flow.
        </p>
      </div>

      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Processing...' : `Pay ₹${amount} with PayPal`}
      </Button>
    </div>
  )
}
