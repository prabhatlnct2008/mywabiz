import { useState } from 'react'
import { useStore } from '@/hooks/useStore'
import { useProducts } from './useProducts'
import { Product } from '@/types/product'
import Button from '@/components/Button'
import ProductList from './ProductList'
import ProductForm from './ProductForm'
import SheetSyncPanel from './SheetSyncPanel'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function ProductsPage() {
  const { store, isLoading: storeLoading, refreshStore } = useStore()
  const {
    products,
    isLoading: productsLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    syncProducts,
  } = useProducts(store?.id)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId)
    }
  }

  const handleFormSubmit = async (data: any) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data)
    } else {
      await createProduct(data)
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  const handleSync = async () => {
    await syncProducts()
  }

  if (storeLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No store found. Please create a store first.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">
          Products
        </h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Product
        </Button>
      </div>

      <SheetSyncPanel store={store} onSync={handleSync} onStoreUpdate={refreshStore} />

      <ProductList
        products={products}
        isLoading={productsLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        product={editingProduct}
      />
    </div>
  )
}
