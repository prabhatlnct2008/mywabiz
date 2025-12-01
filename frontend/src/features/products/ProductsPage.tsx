import Card from '@/components/Card'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import { PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

export default function ProductsPage() {
  const products: unknown[] = [] // TODO: Fetch from API

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">
          Products
        </h1>
        <Button>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Product
        </Button>
      </div>

      <Card padding="none">
        {products.length === 0 ? (
          <EmptyState
            icon={<ShoppingBagIcon className="h-12 w-12" />}
            title="No products yet"
            description="Add your first product to start selling on WhatsApp."
            action={{
              label: 'Add Product',
              onClick: () => {},
            }}
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {/* Product list will go here */}
          </div>
        )}
      </Card>
    </div>
  )
}
