import { useState, useRef } from 'react'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Button from '@/components/Button'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 5,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      // TODO: Implement actual image upload to storage service
      // For now, we'll use placeholder URLs
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))

      onChange([...images, ...newImages].slice(0, maxImages))
    } catch (error) {
      console.error('Failed to upload images:', error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const canAddMore = images.length < maxImages

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Images
      </label>

      <div className="grid grid-cols-3 gap-4">
        {/* Existing images */}
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
            <img
              src={image}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded">
                Primary
              </div>
            )}
          </div>
        ))}

        {/* Upload button */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-500 flex flex-col items-center justify-center text-gray-500 hover:text-primary-500 transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            ) : (
              <>
                <PhotoIcon className="h-8 w-8 mb-2" />
                <span className="text-xs font-medium">Add Image</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="mt-2 text-xs text-gray-500">
        Upload up to {maxImages} images. First image will be the primary image.
      </p>
    </div>
  )
}
