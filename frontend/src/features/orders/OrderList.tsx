import { Order, OrderStatus } from '@/types/order'
import OrderRow from './OrderRow'
import EmptyState from '@/components/EmptyState'
import Select from '@/components/Select'

interface OrderListProps {
  orders: Order[]
  isLoading: boolean
  statusFilter: string | undefined
  onStatusFilterChange: (status: string | undefined) => void
  onOrderClick: (order: Order) => void
}

const statusOptions = [
  { value: '', label: 'All Orders' },
  { value: 'initiated', label: 'Initiated' },
  { value: 'sent_to_whatsapp', label: 'Sent to WhatsApp' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function OrderList({
  orders,
  isLoading,
  statusFilter,
  onStatusFilterChange,
  onOrderClick,
}: OrderListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="animate-pulse p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <EmptyState
          title={statusFilter ? 'No orders found' : 'No orders yet'}
          description={
            statusFilter
              ? 'No orders match the selected filter'
              : 'Orders will appear here when customers place them'
          }
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Select
              label=""
              value={statusFilter || ''}
              onChange={(e) =>
                onStatusFilterChange(e.target.value || undefined)
              }
              options={statusOptions}
            />
          </div>
          <div className="text-sm text-gray-600">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} onClick={onOrderClick} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
