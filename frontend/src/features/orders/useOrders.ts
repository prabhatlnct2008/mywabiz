import { useState, useEffect, useCallback } from 'react'
import { ordersApi } from '@/api/orders'
import { Order, OrderUpdate } from '@/types/order'
import toast from 'react-hot-toast'

export function useOrders(storeId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)

  const fetchOrders = useCallback(async () => {
    if (!storeId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const data = await ordersApi.list(storeId, { status: statusFilter })
      setOrders(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }, [storeId, statusFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const updateOrder = async (orderId: string, data: OrderUpdate) => {
    if (!storeId) return

    try {
      const updatedOrder = await ordersApi.update(storeId, orderId, data)
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)))
      toast.success('Order updated successfully')
      return updatedOrder
    } catch (err) {
      toast.error('Failed to update order')
      throw err
    }
  }

  return {
    orders,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    updateOrder,
    refetch: fetchOrders,
  }
}
