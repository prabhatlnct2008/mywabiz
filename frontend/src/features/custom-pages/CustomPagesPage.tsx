import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '@/components/Button'
import Spinner from '@/components/Spinner'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useCustomPages } from './useCustomPages'
import PageList from './PageList'
import PageEditor from './PageEditor'
import PremiumGate from '../coupons/PremiumGate'

export default function CustomPagesPage() {
  const { storeId } = useParams<{ storeId: string }>()
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isPremium, setIsPremium] = useState(true) // TODO: Get from store context

  const { pages, loading, error, createPage, deletePage } = useCustomPages(
    storeId || ''
  )

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  // Show premium gate if not on premium plan
  if (!isPremium && error?.includes('premium feature')) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Custom Pages
          </h1>
        </div>
        <PremiumGate feature="Custom Pages" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Custom Pages
          </h1>
          <p className="text-gray-600 mt-1">
            Create custom pages for your store like About Us, Privacy Policy, etc.
          </p>
        </div>
        <Button onClick={() => setIsEditorOpen(true)}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Page
        </Button>
      </div>

      {error && !error.includes('premium feature') && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <PageList pages={pages} onDelete={deletePage} />

      <PageEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSubmit={createPage}
      />
    </div>
  )
}
