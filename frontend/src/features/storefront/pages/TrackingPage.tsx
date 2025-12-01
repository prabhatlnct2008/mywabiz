import { useParams } from 'react-router-dom'

export default function TrackingPage() {
  const { trackToken } = useParams()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 font-heading mb-6">
          Track Your Order
        </h1>
        <p className="text-gray-600">
          Tracking token: {trackToken}. Order tracking will be implemented in Track 3.
        </p>
      </div>
    </div>
  )
}
