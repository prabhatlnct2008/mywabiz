import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Card from '@/components/Card'
import { ordersApi } from '@/api/orders'
import { Order } from '@/types/order'

interface RecentOrdersProps {
  storeId: string | undefined
}

const statusColors: Record<string, string> = {
  initiated: 'bg-gray-100 text-gray-700',
  sent_to_whatsapp: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function RecentOrders({ storeId }: RecentOrdersProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!storeId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const data = await ordersApi.list(storeId, { limit: 5 })
        setOrders(data)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [storeId])

  if (isLoading) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('dashboard.recent_orders')}
        </h2>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('dashboard.recent_orders')}
        </h2>
        <p className="text-gray-500 text-center py-8">
          No orders yet. Share your store link to start receiving orders!
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {t('dashboard.recent_orders')}
        </h2>
        <button
          onClick={() => navigate('/dashboard/orders')}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all
        </button>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
            onClick={() => navigate('/dashboard/orders')}
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                #{order.order_number}
              </p>
              <p className="text-sm text-gray-500">{order.customer.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-semibold text-gray-900">
                {order.currency} {order.total}
              </p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusColors[order.status] || statusColors.initiated
                }`}
              >
                {order.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
