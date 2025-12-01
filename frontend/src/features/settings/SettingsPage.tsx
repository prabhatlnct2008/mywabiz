import Card from '@/components/Card'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/Button'

const languages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी (Hindi)' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { value: 'hr', label: 'हरियाणवी (Haryanvi)' },
  { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
]

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 font-heading mb-6">
        Settings
      </h1>

      <div className="space-y-6">
        {/* Store Details */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Store Details
          </h2>
          <div className="space-y-4 max-w-md">
            <Input label="Store name" placeholder="My Store" />
            <Input label="WhatsApp number" placeholder="919876543210" />
            <Select label="Store language" options={languages} />
            <Button>Save Changes</Button>
          </div>
        </Card>

        {/* Shipping */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Shipping
          </h2>
          <div className="space-y-4 max-w-md">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Enable Pickup</span>
              <input type="checkbox" className="h-5 w-5 text-primary-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Enable Delivery</span>
              <input type="checkbox" className="h-5 w-5 text-primary-500" />
            </div>
            <Input label="Delivery fee (₹)" type="number" placeholder="0" />
            <Button>Save Changes</Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <h2 className="text-lg font-semibold text-red-600 mb-4">
            Danger Zone
          </h2>
          <p className="text-gray-600 mb-4">
            Once you delete your store, there is no going back. Please be certain.
          </p>
          <Button variant="danger">Delete Store</Button>
        </Card>
      </div>
    </div>
  )
}
