import Card from '@/components/Card'
import EmptyState from '@/components/EmptyState'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'

export default function OrdersPage() {
  const orders: unknown[] = [] // TODO: Fetch from API

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">
          Orders
        </h1>
      </div>

      <Card padding="none">
        {orders.length === 0 ? (
          <EmptyState
            icon={<ClipboardDocumentListIcon className="h-12 w-12" />}
            title="No orders yet"
            description="Share your store link to start receiving orders via WhatsApp."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {/* Order list will go here */}
          </div>
        )}
      </Card>
    </div>
  )
}
