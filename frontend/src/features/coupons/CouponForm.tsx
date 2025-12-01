import { useState } from 'react'
import Modal from '@/components/Modal'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/Button'
import { CouponCreate, CouponType } from '@/types/coupon'

interface CouponFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CouponCreate) => Promise<void>
}

export default function CouponForm({ isOpen, onClose, onSubmit }: CouponFormProps) {
  const [formData, setFormData] = useState<CouponCreate>({
    code: '',
    type: CouponType.PERCENT,
    value: 0,
    usage_limit: -1,
    min_order_amount: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await onSubmit(formData)
      onClose()
      // Reset form
      setFormData({
        code: '',
        type: CouponType.PERCENT,
        value: 0,
        usage_limit: -1,
        min_order_amount: 0,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to create coupon')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Coupon"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          label="Coupon Code"
          value={formData.code}
          onChange={(e) =>
            setFormData({ ...formData, code: e.target.value.toUpperCase() })
          }
          placeholder="SAVE10"
          required
        />

        <Select
          label="Discount Type"
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value as CouponType })
          }
          options={[
            { value: CouponType.PERCENT, label: 'Percentage' },
            { value: CouponType.FLAT, label: 'Flat Amount' },
          ]}
        />

        <Input
          label={formData.type === CouponType.PERCENT ? 'Discount Percentage' : 'Discount Amount'}
          type="number"
          value={formData.value}
          onChange={(e) =>
            setFormData({ ...formData, value: parseFloat(e.target.value) })
          }
          min="0"
          max={formData.type === CouponType.PERCENT ? '100' : undefined}
          step="0.01"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date (Optional)"
            type="datetime-local"
            value={formData.start_at || ''}
            onChange={(e) =>
              setFormData({ ...formData, start_at: e.target.value || undefined })
            }
          />

          <Input
            label="End Date (Optional)"
            type="datetime-local"
            value={formData.end_at || ''}
            onChange={(e) =>
              setFormData({ ...formData, end_at: e.target.value || undefined })
            }
          />
        </div>

        <Input
          label="Usage Limit"
          type="number"
          value={formData.usage_limit}
          onChange={(e) =>
            setFormData({ ...formData, usage_limit: parseInt(e.target.value) })
          }
          helperText="Set to -1 for unlimited uses"
          min="-1"
        />

        <Input
          label="Minimum Order Amount"
          type="number"
          value={formData.min_order_amount}
          onChange={(e) =>
            setFormData({
              ...formData,
              min_order_amount: parseFloat(e.target.value),
            })
          }
          min="0"
          step="0.01"
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Coupon'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
