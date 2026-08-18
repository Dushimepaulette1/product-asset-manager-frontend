import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService.ts'
import type { ProductDetail as ProductDetailData } from '../../models/types.ts'
import LoadingState from '../../components/LoadingState.tsx'
import EmptyState from '../../components/EmptyState.tsx'
import ErrorState from '../../components/ErrorState.tsx'
import StockStatusBadge from '../../components/StockStatusBadge.tsx'
import Button from '../../components/Button.tsx'

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
    <section className="p-6">
      {status === 'loading' && <LoadingState message="Loading product..." />}

      {status === 'not-found' && <EmptyState message="Product not found." />}

      {status === 'error' && <ErrorState message={errorMessage} onRetry={handleRetry} />}

      {status === 'found' && product && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <Button onClick={() => navigate(`/admin/products/${product.id}/edit`)}>Edit</Button>
          </div>

          <div className="mb-6 rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{product.categoryName}</p>
            <p className="mt-2 text-gray-700">{product.description}</p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">Variants</h2>
            {product.variants.length === 0 ? (
              <EmptyState message="This product has no active variants." />
            ) : (
              <ul className="flex flex-col gap-2">
                {product.variants.map((variant) => (
                  <li
                    key={variant.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                  >
                    <span className="text-sm text-gray-700">{variant.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">
                        ${variant.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">Qty: {variant.stockQuantity}</span>
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
