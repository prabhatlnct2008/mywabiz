import { OrderStatus } from '@/types/order'

interface StatusBadgeProps {
  status: OrderStatus
}

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string }
> = {
  initiated: {
    label: 'Initiated',
    color: 'bg-gray-100 text-gray-700',
  },
  sent_to_whatsapp: {
    label: 'Sent to WhatsApp',
    color: 'bg-blue-100 text-blue-700',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-green-100 text-green-700',
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-purple-100 text-purple-700',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-700',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700',
  },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.initiated

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  )
}
