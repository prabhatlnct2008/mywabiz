import { useState } from 'react'
import Card from '@/components/Card'
import Chip from '@/components/Chip'
import Button from '@/components/Button'
import { Coupon, CouponStatus, CouponType } from '@/types/coupon'
import { TrashIcon, PencilIcon, TicketIcon } from '@heroicons/react/24/outline'

interface CouponListProps {
  coupons: Coupon[]
  onDelete: (couponId: string) => Promise<void>
}

export default function CouponList({ coupons, onDelete }: CouponListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return

    setDeletingId(couponId)
    try {
      await onDelete(couponId)
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusColor = (status: CouponStatus) => {
    switch (status) {
      case CouponStatus.ACTIVE:
        return 'success'
      case CouponStatus.EXPIRED:
        return 'error'
      case CouponStatus.DISABLED:
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const formatValue = (coupon: Coupon) => {
    if (coupon.type === CouponType.PERCENT) {
      return `${coupon.value}% OFF`
    }
    return `₹${coupon.value} OFF`
  }

  if (coupons.length === 0) {
    return (
      <Card className="text-center py-12">
        <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons yet</h3>
        <p className="text-gray-600">Create your first coupon to offer discounts to your customers.</p>
      </Card>
    )
  }

  return (
    <Card padding="none">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valid Until
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <TicketIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="font-mono font-medium text-gray-900">
                      {coupon.code}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {formatValue(coupon)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {coupon.used_count}
                    {coupon.usage_limit > 0 && ` / ${coupon.usage_limit}`}
                    {coupon.usage_limit === -1 && ' / ∞'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Chip color={getStatusColor(coupon.status)}>
                    {coupon.status}
                  </Chip>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {coupon.end_at
                    ? new Date(coupon.end_at).toLocaleDateString()
                    : 'No expiry'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(coupon.id)}
                      disabled={deletingId === coupon.id}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
