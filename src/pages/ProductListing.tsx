import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../services/productService.ts'
import LoadingState from '../components/shared/LoadingState.tsx'
import EmptyState from '../components/shared/EmptyState.tsx'
import ErrorState from '../components/shared/ErrorState.tsx'
import SearchBar from '../components/shared/SearchBar.tsx'
import MaxPriceFilter from '../components/shared/MaxPriceFilter.tsx'
import ProductCard from '../components/shared/ProductCard.tsx'
import { useAsync } from '../hooks/useAsync.ts'

function ProductListing() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)

  const fetchProducts = useCallback(
    () => productService.find({ keyword: keyword.trim() || undefined, maxPrice }),
    [keyword, maxPrice],
  )

  const { data: products = [], status, errorMessage, retry } = useAsync(fetchProducts)

  const hasActiveFilters = keyword.trim() !== '' || maxPrice !== undefined

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">Full catalog</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Everything you need, all in one place.
        </h1>
        <p className="mt-4 max-w-md text-zinc-500">
          Search, filter by price, and find exactly what you're looking for — from footwear to
          electronics.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-6 flex flex-wrap gap-4">
          <SearchBar value={keyword} onChange={setKeyword} />
          <MaxPriceFilter value={maxPrice} onChange={setMaxPrice} />
        </div>

        {status === 'loading' && <LoadingState message="Loading products..." />}

        {status === 'error' && <ErrorState message={errorMessage} onRetry={retry} />}

        {status === 'success' && products.length === 0 && (
          <EmptyState
            message={hasActiveFilters ? 'No products match your search.' : 'No products found.'}
          />
        )}

        {status === 'success' && products.length > 0 && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/products/${product.id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default ProductListing
