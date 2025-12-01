import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '@/components/Button'
import Spinner from '@/components/Spinner'
import { PlusIcon, TicketIcon } from '@heroicons/react/24/outline'
import { useCoupons } from './useCoupons'
import CouponList from './CouponList'
import CouponForm from './CouponForm'
import PremiumGate from './PremiumGate'

export default function CouponsPage() {
  const { storeId } = useParams<{ storeId: string }>()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPremium, setIsPremium] = useState(true) // TODO: Get from store context

  const { coupons, loading, error, createCoupon, deleteCoupon } = useCoupons(
    storeId || ''
  )

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  // Show premium gate if not on premium plan
  if (!isPremium && error?.includes('premium feature')) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Coupons
          </h1>
        </div>
        <PremiumGate feature="Coupons" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Coupons
          </h1>
          <p className="text-gray-600 mt-1">
            Create discount coupons for your customers
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Coupon
        </Button>
      </div>

      {error && !error.includes('premium feature') && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <CouponList coupons={coupons} onDelete={deleteCoupon} />

      <CouponForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={createCoupon}
      />
    </div>
  )
}
