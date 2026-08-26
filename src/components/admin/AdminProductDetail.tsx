import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService.ts'
import type { ProductDetail as ProductDetailData } from '../../models/types.ts'
import LoadingState from '../shared/LoadingState.tsx'
import EmptyState from '../shared/EmptyState.tsx'
import ErrorState from '../shared/ErrorState.tsx'
import StockStatusBadge from '../shared/StockStatusBadge.tsx'
import ProductImage from '../shared/ProductImage.tsx'
import Button from '../shared/Button.tsx'

type Status = 'loading' | 'found' | 'not-found' | 'error'

function AdminProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductDetailData | undefined>(undefined)
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  const fetchProduct = useCallback(() => {
    if (!productId) return

    productService
      .findById(productId)
      .then((result) => {
        if (result) {
          setProduct(result)
          setStatus('found')
        } else {
          setErrorMessage('Product not found.')
          setStatus('not-found')
        }
      })
      .catch((err: Error) => {
        setErrorMessage(err.message)
        setStatus('error')
      })
  }, [productId])

  function handleRetry() {
    setStatus('loading')
    fetchProduct()
  }

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      {status === 'loading' && <LoadingState message="Loading product..." />}

      {status === 'not-found' && <EmptyState message="Product not found." />}

      {status === 'error' && <ErrorState message={errorMessage} onRetry={handleRetry} />}

      {status === 'found' && product && (
        <>
          <div className="mb-8 flex items-end justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-zinc-200">
                <ProductImage imageUrl={product.imageUrl} name={product.name} className="h-full w-full" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">
                  {product.categoryName}
                </p>
                <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-zinc-900">
                  {product.name}
                </h1>
              </div>
            </div>
            <Button onClick={() => navigate(`/admin/products/${product.id}/edit`)}>Edit</Button>
          </div>

          <div className="mb-8 rounded-2xl border border-zinc-200 bg-white/70 p-5">
            <p className="text-zinc-700">{product.description}</p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">Variants</h2>
            {product.variants.length === 0 ? (
              <EmptyState message="This product has no active variants." />
            ) : (
              <ul className="flex flex-col gap-2">
                {product.variants.map((variant) => (
                  <li
                    key={variant.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-200 p-4"
                  >
                    <span className="text-sm text-zinc-700">{variant.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-zinc-900">
                        ${variant.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-zinc-500">Qty: {variant.stockQuantity}</span>
                      <StockStatusBadge status={variant.stockStatus} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4">
            <Button variant="secondary" onClick={() => navigate('/admin/products')}>
              Back to Product List
            </Button>
          </div>
        </>
      )}
    </section>
  )
}

export default AdminProductDetail
