import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService.ts'
import type { ProductWithStartingPrice } from '../../models/types.ts'
import DataTable from '../../components/DataTable.tsx'
import LoadingState from '../../components/LoadingState.tsx'
import EmptyState from '../../components/EmptyState.tsx'
import ErrorState from '../../components/ErrorState.tsx'
import Button from '../../components/Button.tsx'
import { useAsync } from '../../hooks/useAsync.ts'

function AdminProductList() {
  const navigate = useNavigate()

  const fetchProducts = useCallback(() => productService.find(), [])
  const { data: products = [], status, errorMessage, retry } = useAsync(fetchProducts)

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">Admin</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-zinc-900">
            Product List
          </h1>
        </div>
        <Button onClick={() => navigate('/admin/products/new')}>Create Product</Button>
      </div>

      {status === 'loading' && <LoadingState message="Loading products..." />}

      {status === 'error' && <ErrorState message={errorMessage} onRetry={retry} />}

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
          onItemClick={(product) => navigate(`/admin/products/${product.id}`)}
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
