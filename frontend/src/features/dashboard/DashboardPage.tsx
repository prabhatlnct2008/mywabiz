import { useTranslation } from 'react-i18next'
import { useStore } from '@/hooks/useStore'
import StatsCards from './StatsCards'
import QuickActions from './QuickActions'
import RecentOrders from './RecentOrders'
import { useStoreStats } from './useStoreStats'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { store, isLoading: storeLoading } = useStore()
  const { stats, isLoading: statsLoading } = useStoreStats(store?.id)

  if (storeLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 font-heading mb-6">
        {t('dashboard.welcome')}
      </h1>

      <StatsCards stats={stats} isLoading={statsLoading} />
      <QuickActions storeSlug={store?.slug} />
      <RecentOrders storeId={store?.id} />
    </div>
  )
}
