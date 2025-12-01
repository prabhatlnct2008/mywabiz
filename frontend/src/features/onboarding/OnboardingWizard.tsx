import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Input'
import Select from '@/components/Select'

const templates = [
  { id: 'multi-purpose', name: 'Multi-purpose', emoji: '🏪' },
  { id: 'quick-order', name: 'Quick Order', emoji: '⚡' },
  { id: 'wholesale', name: 'Wholesale', emoji: '📦' },
  { id: 'digital-download', name: 'Digital Download', emoji: '💾' },
  { id: 'service-booking', name: 'Service Booking', emoji: '📅' },
  { id: 'links-list', name: 'Links List', emoji: '🔗' },
  { id: 'blank', name: 'Start from scratch', emoji: '✨' },
]

const languages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी (Hindi)' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { value: 'hr', label: 'हरियाणवी (Haryanvi)' },
  { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
]

export default function OnboardingWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    template: 'multi-purpose',
    name: '',
    whatsapp: '',
    language: 'en',
  })

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // TODO: Create store via API
      navigate('/dashboard')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s <= step
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    s < step ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card>
          {/* Step 1: Template */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Choose a template
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() =>
                      setFormData({ ...formData, template: template.id })
                    }
                    className={`p-4 rounded-xl border-2 text-left transition-colors ${
                      formData.template === template.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{template.emoji}</span>
                    <p className="mt-2 font-medium text-gray-900">
                      {template.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Store Basics */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Store basics
              </h2>
              <div className="space-y-4">
                <Input
                  label="Store name"
                  placeholder="My Awesome Store"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <Input
                  label="WhatsApp number"
                  placeholder="919876543210"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                  helperText="Include country code (e.g., 91 for India)"
                />
                <Select
                  label="Store language"
                  options={languages}
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* Step 3: Catalog */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Set up your catalog
              </h2>
              <p className="text-gray-600 mb-4">
                You can add products using Google Sheets or directly in the dashboard.
              </p>
              <div className="space-y-4">
                <button className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-primary-500 text-left transition-colors">
                  <p className="font-medium text-gray-900">
                    📊 Use Google Sheets
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Copy our template and add products in spreadsheet
                  </p>
                </button>
                <button className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-primary-500 text-left transition-colors">
                  <p className="font-medium text-gray-900">
                    ➕ Add products manually
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Add products one by one in the dashboard
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Your store is ready!
              </h2>
              <div className="bg-gray-100 rounded-xl p-8 text-center">
                <p className="text-gray-500 mb-4">Store preview</p>
                <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs mx-auto">
                  <div className="h-8 w-8 bg-primary-500 rounded-lg mx-auto mb-2" />
                  <p className="font-semibold">{formData.name || 'Your Store'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              {step === 4 ? 'Go to Dashboard' : 'Continue'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
