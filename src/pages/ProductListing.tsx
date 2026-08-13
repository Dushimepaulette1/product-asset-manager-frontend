import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../services/productService.ts'
import type { ProductWithStartingPrice } from '../models/types.ts'
import DataTable from '../components/DataTable.tsx'
import LoadingState from '../components/LoadingState.tsx'
import EmptyState from '../components/EmptyState.tsx'
import ErrorState from '../components/ErrorState.tsx'

type Status = 'loading' | 'success' | 'error'

function ProductListing() {
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
      <h1 className="mb-4 text-2xl font-semibold">Product Listing</h1>

      {status === 'loading' && <LoadingState message="Loading products..." />}

      {status === 'error' && <ErrorState message={errorMessage} onRetry={handleRetry} />}

      {status === 'success' && products.length === 0 && (
        <EmptyState message="No products found." />
      )}

      {status === 'success' && products.length > 0 && (
        <DataTable<ProductWithStartingPrice>
          items={products}
          getKey={(product) => product.id}
          onItemClick={(product) => navigate(`/products/${product.id}`)}
          columns={[
            { header: 'Name', render: (product) => product.name },
            { header: 'Category', render: (product) => product.categoryName },
            {
              header: 'Starting Price',
              render: (product) =>
                product.startingPrice !== undefined ? `$${product.startingPrice.toFixed(2)}` : '—',
            },
          ]}
        />
      )}
    </section>
  )
}

export default ProductListing
