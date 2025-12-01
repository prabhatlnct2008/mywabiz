import { useState } from 'react'
import Card from '@/components/Card'
import Chip from '@/components/Chip'
import Button from '@/components/Button'
import { CustomPage, PageStatus } from '@/types/custom-page'
import { TrashIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

interface PageListProps {
  pages: CustomPage[]
  onDelete: (pageId: string) => Promise<void>
}

export default function PageList({ pages, onDelete }: PageListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return

    setDeletingId(pageId)
    try {
      await onDelete(pageId)
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusColor = (status: PageStatus) => {
    switch (status) {
      case PageStatus.PUBLISHED:
        return 'success'
      case PageStatus.DRAFT:
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  if (pages.length === 0) {
    return (
      <Card className="text-center py-12">
        <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No pages yet</h3>
        <p className="text-gray-600">
          Create custom pages like About Us, Terms of Service, Privacy Policy, etc.
        </p>
      </Card>
    )
  }

  return (
    <Card padding="none">
      <div className="divide-y divide-gray-200">
        {pages.map((page) => (
          <div
            key={page.id}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {page.title}
                  </h3>
                  <Chip color={getStatusColor(page.status)}>
                    {page.status}
                  </Chip>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-mono">/{page.slug}</span>
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {page.content.substring(0, 150)}
                  {page.content.length > 150 && '...'}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Last updated: {new Date(page.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(page.id)}
                  disabled={deletingId === page.id}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
