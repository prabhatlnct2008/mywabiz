import { useTranslation } from 'react-i18next'
import Card from '@/components/Card'

export default function DashboardPage() {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 font-heading mb-6">
        {t('dashboard.welcome')}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: t('dashboard.orders'), value: '0', change: '+0%' },
          { label: t('dashboard.sales'), value: '₹0', change: '+0%' },
          { label: t('dashboard.visits'), value: '0', change: '+0%' },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className="text-sm text-green-600 mt-1">{stat.change}</p>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('dashboard.quick_actions')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('dashboard.add_product'), icon: '📦' },
            { label: t('dashboard.design_store'), icon: '🎨' },
            { label: t('dashboard.share_store'), icon: '🔗' },
            { label: t('dashboard.upgrade'), icon: '⭐' },
          ].map((action) => (
            <button
              key={action.label}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <span className="text-2xl mb-2">{action.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Recent orders */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('dashboard.recent_orders')}
        </h2>
        <p className="text-gray-500 text-center py-8">
          No orders yet. Share your store link to start receiving orders!
        </p>
      </Card>
    </div>
  )
}
