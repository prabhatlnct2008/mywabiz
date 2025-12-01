import { useState, useEffect } from 'react'
import { Product, ProductCreate, ProductUpdate } from '@/types/product'
import Modal from '@/components/Modal'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/Button'
import ImageUploader from './ImageUploader'

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProductCreate | ProductUpdate) => Promise<void>
  product?: Product | null
}

export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  product,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductCreate>({
    name: '',
    category: '',
    price: 0,
    description: '',
    sizes: [],
    colors: [],
    tags: [],
    brand: '',
    stock: 0,
    availability: 'show',
    image_urls: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sizeInput, setSizeInput] = useState('')
  const [colorInput, setColorInput] = useState('')

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        sizes: product.sizes,
        colors: product.colors,
        tags: product.tags,
        brand: product.brand,
        stock: product.stock,
        availability: product.availability,
        thumbnail_url: product.thumbnail_url,
        image_urls: product.image_urls,
      })
    } else {
      setFormData({
        name: '',
        category: '',
        price: 0,
        description: '',
        sizes: [],
        colors: [],
        tags: [],
        brand: '',
        stock: 0,
        availability: 'show',
        image_urls: [],
      })
    }
  }, [product, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Failed to save product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddSize = () => {
    if (sizeInput.trim() && !formData.sizes?.includes(sizeInput.trim())) {
      setFormData({
        ...formData,
        sizes: [...(formData.sizes || []), sizeInput.trim()],
      })
      setSizeInput('')
    }
  }

  const handleAddColor = () => {
    if (colorInput.trim() && !formData.colors?.includes(colorInput.trim())) {
      setFormData({
        ...formData,
        colors: [...(formData.colors || []), colorInput.trim()],
      })
      setColorInput('')
    }
  }

  const handleRemoveSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes?.filter((s) => s !== size) || [],
    })
  }

  const handleRemoveColor = (color: string) => {
    setFormData({
      ...formData,
      colors: formData.colors?.filter((c) => c !== color) || [],
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product' : 'Add Product'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Images */}
        <ImageUploader
          images={formData.image_urls || []}
          onChange={(images) => setFormData({ ...formData, image_urls: images })}
        />

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Product Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Cotton T-Shirt"
          />
          <Input
            label="Category"
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Clothing"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price"
            type="number"
            required
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            placeholder="0"
          />
          <Input
            label="Stock"
            type="number"
            value={formData.stock || ''}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
            placeholder="0"
          />
        </div>

        <Input
          label="Brand"
          value={formData.brand || ''}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          placeholder="e.g., Nike"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Product description..."
          />
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sizes
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., S, M, L, XL"
            />
            <Button type="button" onClick={handleAddSize} size="md">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.sizes?.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
              >
                {size}
                <button
                  type="button"
                  onClick={() => handleRemoveSize(size)}
                  className="hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Colors
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Red, Blue, Green"
            />
            <Button type="button" onClick={handleAddColor} size="md">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.colors?.map((color) => (
              <span
                key={color}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
              >
                {color}
                <button
                  type="button"
                  onClick={() => handleRemoveColor(color)}
                  className="hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <Select
          label="Availability"
          value={formData.availability || 'show'}
          onChange={(e) =>
            setFormData({ ...formData, availability: e.target.value as 'show' | 'hide' })
          }
          options={[
            { value: 'show', label: 'Show on store' },
            { value: 'hide', label: 'Hide from store' },
          ]}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
