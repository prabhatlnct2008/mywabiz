import { useState } from 'react'
import { useStore } from '@/hooks/useStore'
import { useOrders } from './useOrders'
import { Order, OrderStatus } from '@/types/order'
import OrderList from './OrderList'
import OrderDetail from './OrderDetail'

export default function OrdersPage() {
  const { store, isLoading: storeLoading } = useStore()
  const {
    orders,
    isLoading: ordersLoading,
    statusFilter,
    setStatusFilter,
    updateOrder,
  } = useOrders(store?.id)

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
  }

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    await updateOrder(orderId, { status })
    setIsDetailOpen(false)
  }

  if (storeLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No store found. Please create a store first.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">
          Orders
        </h1>
      </div>

      <OrderList
        orders={orders}
        isLoading={ordersLoading}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onOrderClick={handleOrderClick}
      />

      <OrderDetail
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  )
}
