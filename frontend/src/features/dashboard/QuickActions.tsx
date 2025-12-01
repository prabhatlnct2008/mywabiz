import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Card from '@/components/Card'
import {
  PlusIcon,
  PaintBrushIcon,
  ShareIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

interface QuickActionsProps {
  storeSlug?: string
}

export default function QuickActions({ storeSlug }: QuickActionsProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const actions = [
    {
      label: t('dashboard.add_product'),
      icon: PlusIcon,
      color: 'hover:border-blue-500 hover:bg-blue-50',
      iconColor: 'text-blue-600',
      onClick: () => navigate('/dashboard/products'),
    },
    {
      label: t('dashboard.design_store'),
      icon: PaintBrushIcon,
      color: 'hover:border-purple-500 hover:bg-purple-50',
      iconColor: 'text-purple-600',
      onClick: () => navigate('/dashboard/design'),
    },
    {
      label: t('dashboard.share_store'),
      icon: ShareIcon,
      color: 'hover:border-green-500 hover:bg-green-50',
      iconColor: 'text-green-600',
      onClick: () => {
        if (storeSlug) {
          const url = `${window.location.origin}/store/${storeSlug}`
          navigator.clipboard.writeText(url)
          // TODO: Show toast notification
        }
      },
    },
    {
      label: t('dashboard.upgrade'),
      icon: SparklesIcon,
      color: 'hover:border-amber-500 hover:bg-amber-50',
      iconColor: 'text-amber-600',
      onClick: () => navigate('/dashboard/settings'),
    },
  ]

  return (
    <Card className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {t('dashboard.quick_actions')}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 transition-all ${action.color}`}
          >
            <action.icon className={`h-6 w-6 mb-2 ${action.iconColor}`} />
            <span className="text-sm font-medium text-gray-700">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </Card>
  )
}
