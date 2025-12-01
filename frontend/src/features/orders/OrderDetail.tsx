import { Order, OrderStatus } from '@/types/order'
import Modal from '@/components/Modal'
import Button from '@/components/Button'
import StatusBadge from './StatusBadge'
import Select from '@/components/Select'
import { useState } from 'react'

interface OrderDetailProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>
}

const statusOptions = [
  { value: 'initiated', label: 'Initiated' },
  { value: 'sent_to_whatsapp', label: 'Sent to WhatsApp' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function OrderDetail({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
}: OrderDetailProps) {
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('')
  const [isUpdating, setIsUpdating] = useState(false)

  if (!order) return null

  const handleUpdateStatus = async () => {
    if (!newStatus) return

    setIsUpdating(true)
    try {
      await onUpdateStatus(order.id, newStatus)
      setNewStatus('')
    } finally {
      setIsUpdating(false)
    }
  }

  const formattedDate = new Date(order.created_at).toLocaleString()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order #${order.order_number}`} size="xl">
      <div className="space-y-6">
        {/* Status and Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <StatusBadge status={order.status} />
            <p className="text-sm text-gray-500 mt-2">{formattedDate}</p>
          </div>

          <div className="flex gap-2">
            <Select
              label=""
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              options={[
                { value: '', label: 'Update status...' },
                ...statusOptions,
              ]}
            />
            <Button
              onClick={handleUpdateStatus}
              disabled={!newStatus || newStatus === order.status}
              isLoading={isUpdating}
              size="md"
            >
              Update
            </Button>
          </div>
        </div>

        {/* Customer Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Name:</span>
              <span className="text-sm font-medium text-gray-900">
                {order.customer.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Phone:</span>
              <span className="text-sm font-medium text-gray-900">
                {order.customer.phone}
              </span>
            </div>
            {order.customer.email && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium text-gray-900">
                  {order.customer.email}
                </span>
              </div>
            )}
            {order.customer.address && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Address:</span>
                <span className="text-sm font-medium text-gray-900 text-right">
                  {order.customer.address}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Items</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  {(item.size || item.color) && (
                    <p className="text-sm text-gray-500">
                      {[item.size, item.color].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {order.currency} {item.line_total}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × {order.currency} {item.unit_price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium text-gray-900">
              {order.currency} {order.subtotal}
            </span>
          </div>

          {order.shipping_fee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping ({order.shipping_method}):</span>
              <span className="font-medium text-gray-900">
                {order.currency} {order.shipping_fee}
              </span>
            </div>
          )}

          {order.discount_amount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Discount {order.coupon_code && `(${order.coupon_code})`}:
              </span>
              <span className="font-medium text-green-600">
                -{order.currency} {order.discount_amount}
              </span>
            </div>
          )}

          <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
            <span className="text-gray-900">Total:</span>
            <span className="text-gray-900">
              {order.currency} {order.total}
            </span>
          </div>

          <div className="flex justify-between text-sm pt-2">
            <span className="text-gray-600">Payment:</span>
            <span className="font-medium text-gray-900">
              {order.payment_method === 'cash' ? 'Cash on Delivery' : 'PayPal'} (
              {order.payment_status})
            </span>
          </div>
        </div>

        {/* WhatsApp Link */}
        {order.whatsapp_url && (
          <div>
            <a
              href={order.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
            >
              Open in WhatsApp
            </a>
          </div>
        )}
      </div>
    </Modal>
  )
}
