import { useTranslation } from 'react-i18next'
import Card from '@/components/Card'
import { StoreStats } from '@/types/store'
import {
  ShoppingBagIcon,
  CurrencyRupeeIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface StatsCardsProps {
  stats: StoreStats | null
  isLoading: boolean
}

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const { t } = useTranslation()

  const statsData = [
    {
      label: t('dashboard.orders'),
      value: stats?.orders_count ?? 0,
      change: '+0%',
      icon: ShoppingBagIcon,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: t('dashboard.sales'),
      value: `₹${stats?.sales_total ?? 0}`,
      change: '+0%',
      icon: CurrencyRupeeIcon,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: t('dashboard.visits'),
      value: stats?.visits ?? 0,
      change: '+0%',
      icon: EyeIcon,
      color: 'text-purple-600 bg-purple-50',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-16 mb-1" />
              <div className="h-4 bg-gray-200 rounded w-12" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statsData.map((stat) => (
        <Card key={stat.label} className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-green-600 mt-1">{stat.change}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
