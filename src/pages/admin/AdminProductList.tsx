import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService.ts'
import type { ProductWithStartingPrice } from '../../models/types.ts'
import DataTable from '../../components/DataTable.tsx'
import LoadingState from '../../components/LoadingState.tsx'
import EmptyState from '../../components/EmptyState.tsx'
import ErrorState from '../../components/ErrorState.tsx'
import Button from '../../components/Button.tsx'

type Status = 'loading' | 'success' | 'error'

function AdminProductList() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<ProductWithStartingPrice[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  function fetchProducts() {
    return productService
      .find()
      .then((results) => {
        setProducts(results)
        setStatus('success')
      })
      .catch((err: Error) => {
        setErrorMessage(err.message)
        setStatus('error')
      })
  }

  function handleRetry() {
    setStatus('loading')
    fetchProducts()
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <section className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Product List</h1>
        <Button onClick={() => navigate('/admin/products/new')}>Create Product</Button>
      </div>

      {status === 'loading' && <LoadingState message="Loading products..." />}

      {status === 'error' && <ErrorState message={errorMessage} onRetry={handleRetry} />}

      {status === 'success' && products.length === 0 && (
        <EmptyState
          message="No products yet."
          action={{ label: 'Create your first product', onClick: () => navigate('/admin/products/new') }}
        />
      )}

      {status === 'success' && products.length > 0 && (
        <DataTable<ProductWithStartingPrice>
          items={products}
          getKey={(product) => product.id}
          onItemClick={(product) => navigate(`/admin/products/${product.id}/edit`)}
          columns={[
            { header: 'Name', render: (product) => product.name },
            { header: 'Category', render: (product) => product.categoryName },
          ]}
        />
      )}
    </section>
  )
}

export default AdminProductList
