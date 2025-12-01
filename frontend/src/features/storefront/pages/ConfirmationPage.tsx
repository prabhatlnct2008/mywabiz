import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from '../hooks/useStore'
import WhatsAppRedirect from '../components/WhatsAppRedirect'
import Spinner from '@/components/Spinner'
import { Order } from '@/types/order'

export default function ConfirmationPage() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { store, isLoading } = useStore(slug!)

  const order = location.state?.order as (Order & { whatsapp_url: string }) | undefined

  useEffect(() => {
    // If no order in state, redirect to store
    if (!order && !isLoading) {
      navigate(`/${slug}`)
    }
  }, [order, isLoading, navigate, slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!store || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order not found
          </h1>
          <p className="text-gray-600">
            Unable to load order details. Please try again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <WhatsAppRedirect
      whatsappUrl={order.whatsapp_url}
      orderNumber={order.order_number}
      brandColor={store.branding.brand_color}
    />
  )
}
