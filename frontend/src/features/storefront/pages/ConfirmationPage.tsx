import { useParams } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

export default function ConfirmationPage() {
  const { slug } = useParams()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <CheckCircleIcon className="h-16 w-16 text-primary-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 font-heading mb-2">
          Order Placed!
        </h1>
        <p className="text-gray-600">
          Store: {slug}. Order confirmation will be implemented in Track 3.
        </p>
      </div>
    </div>
  )
}
