import { useState } from 'react'
import { Store } from '@/types/store'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { storesApi } from '@/api/stores'
import { ArrowPathIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface SheetSyncPanelProps {
  store: Store
  onSync: () => Promise<void>
  onStoreUpdate: () => void
}

export default function SheetSyncPanel({ store, onSync, onStoreUpdate }: SheetSyncPanelProps) {
  const [sheetUrl, setSheetUrl] = useState(store.sheets_config.sheet_url || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSaveSheetUrl = async () => {
    setIsSaving(true)
    try {
      await storesApi.update(store.id, {
        sheets_config: {
          sheet_url: sheetUrl,
        },
      })
      toast.success('Sheet URL saved')
      onStoreUpdate()
    } catch (error) {
      toast.error('Failed to save sheet URL')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSync = async () => {
    if (!store.sheets_config.sheet_url) {
      toast.error('Please add a sheet URL first')
      return
    }

    setIsSyncing(true)
    try {
      await onSync()
    } finally {
      setIsSyncing(false)
    }
  }

  const lastSynced = store.sheets_config.last_synced_at
    ? new Date(store.sheets_config.last_synced_at).toLocaleString()
    : 'Never'

  const syncStatus = store.sheets_config.sync_status

  return (
    <Card className="mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
            Google Sheets Sync
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sync products from your Google Sheet
          </p>
        </div>

        {syncStatus === 'syncing' && (
          <div className="flex items-center gap-2 text-blue-600">
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Syncing...</span>
          </div>
        )}

        {syncStatus === 'error' && (
          <div className="flex items-center gap-2 text-red-600">
            <ExclamationCircleIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Sync failed</span>
          </div>
        )}

        {syncStatus === 'idle' && store.sheets_config.last_synced_at && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircleIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Synced</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              label="Google Sheet URL"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              helperText="Make sure the sheet is publicly accessible"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleSaveSheetUrl}
              isLoading={isSaving}
              disabled={sheetUrl === store.sheets_config.sheet_url}
              size="md"
            >
              Save URL
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <p>Last synced: <span className="font-medium">{lastSynced}</span></p>
            {store.sheets_config.sync_error && (
              <p className="text-red-600 mt-1">{store.sheets_config.sync_error}</p>
            )}
          </div>

          <Button
            onClick={handleSync}
            isLoading={isSyncing}
            disabled={!store.sheets_config.sheet_url}
            variant="secondary"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Force Sync
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Use our{' '}
            <a
              href="https://docs.google.com/spreadsheets/d/YOUR_TEMPLATE_ID/copy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              Google Sheets template
            </a>{' '}
            to get started quickly with the correct format.
          </p>
        </div>
      </div>
    </Card>
  )
}
