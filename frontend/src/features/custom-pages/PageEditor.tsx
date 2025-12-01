import { useState } from 'react'
import Modal from '@/components/Modal'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/Button'
import { CustomPageCreate, PageStatus } from '@/types/custom-page'

interface PageEditorProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CustomPageCreate) => Promise<void>
}

export default function PageEditor({ isOpen, onClose, onSubmit }: PageEditorProps) {
  const [formData, setFormData] = useState<CustomPageCreate>({
    title: '',
    slug: '',
    content: '',
    status: PageStatus.DRAFT,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await onSubmit(formData)
      onClose()
      // Reset form
      setFormData({
        title: '',
        slug: '',
        content: '',
        status: PageStatus.DRAFT,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to create page')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Custom Page"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          label="Page Title"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="About Us"
          required
        />

        <Input
          label="URL Slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="about-us"
          helperText="This will be the URL path for your page"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Write your page content here... (Markdown supported)"
          />
          <p className="mt-1 text-xs text-gray-500">
            You can use Markdown formatting for rich text
          </p>
        </div>

        <Select
          label="Status"
          value={formData.status || PageStatus.DRAFT}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value as PageStatus })
          }
          options={[
            { value: PageStatus.DRAFT, label: 'Draft' },
            { value: PageStatus.PUBLISHED, label: 'Published' },
          ]}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Page'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
