import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../services/productService.ts'
import type { ProductWithStartingPrice } from '../models/types.ts'
import DataTable from '../components/DataTable.tsx'
import LoadingState from '../components/LoadingState.tsx'
import EmptyState from '../components/EmptyState.tsx'
import ErrorState from '../components/ErrorState.tsx'
import SearchBar from '../components/SearchBar.tsx'
import MaxPriceFilter from '../components/MaxPriceFilter.tsx'

type Status = 'loading' | 'success' | 'error'

function ProductListing() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<ProductWithStartingPrice[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [keyword, setKeyword] = useState('')
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)

  const fetchProducts = useCallback(() => {
    return productService
      .find({ keyword: keyword.trim() || undefined, maxPrice })
      .then((results) => {
        setProducts(results)
        setStatus('success')
      })
      .catch((err: Error) => {
        setErrorMessage(err.message)
        setStatus('error')
      })
  }, [keyword, maxPrice])

  function handleRetry() {
    setStatus('loading')
    fetchProducts()
  }

  function handleKeywordChange(value: string) {
    setKeyword(value)
    setStatus('loading')
  }

  function handleMaxPriceChange(value: number | undefined) {
    setMaxPrice(value)
    setStatus('loading')
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const hasActiveFilters = keyword.trim() !== '' || maxPrice !== undefined

  return (
    <section className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Product Listing</h1>

      <div className="mb-4 flex flex-wrap gap-4">
        <SearchBar value={keyword} onChange={handleKeywordChange} />
        <MaxPriceFilter value={maxPrice} onChange={handleMaxPriceChange} />
      </div>

      {status === 'loading' && <LoadingState message="Loading products..." />}

      {status === 'error' && <ErrorState message={errorMessage} onRetry={handleRetry} />}

      {status === 'success' && products.length === 0 && (
        <EmptyState
          message={hasActiveFilters ? 'No products match your search.' : 'No products found.'}
        />
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
