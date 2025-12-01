import { Order } from '@/types/order'
import StatusBadge from './StatusBadge'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

interface OrderRowProps {
  order: Order
  onClick: (order: Order) => void
}

export default function OrderRow({ order, onClick }: OrderRowProps) {
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <tr
      onClick={() => onClick(order)}
      className="hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">#{order.order_number}</div>
        <div className="text-sm text-gray-500">{formattedDate}</div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{order.customer.name}</div>
        <div className="text-sm text-gray-500">{order.customer.phone}</div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </div>
        <div className="text-sm text-gray-500">
          {order.shipping_method === 'pickup' ? 'Pickup' : 'Delivery'}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-semibold text-gray-900">
          {order.currency} {order.total}
        </div>
        <div className="text-sm text-gray-500">
          {order.payment_method === 'cash' ? 'Cash' : 'PayPal'}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={order.status} />
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right">
        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
      </td>
    </tr>
  )
}
