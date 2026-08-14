import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService.ts'
import { purchaseService } from '../services/purchaseService.ts'
import type { PurchaseError } from '../services/purchaseService.ts'
import type { ProductDetail as ProductDetailData } from '../models/types.ts'
import { getStockStatus } from '../models/types.ts'
import LoadingState from '../components/LoadingState.tsx'
import EmptyState from '../components/EmptyState.tsx'
import ErrorState from '../components/ErrorState.tsx'
import StockStatusBadge from '../components/StockStatusBadge.tsx'
import Button from '../components/Button.tsx'
import { useAuth } from '../context/useAuth.ts'

type Status = 'loading' | 'found' | 'not-found' | 'error'

type BuyStatus = 'idle' | 'loading' | 'success' | 'error'

function ProductDetail() {
  const { user } = useAuth()
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductDetailData | undefined>(undefined)
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined)
  const [buyStatus, setBuyStatus] = useState<BuyStatus>('idle')
  const [buyErrorMessage, setBuyErrorMessage] = useState('')
  const [buyErrorReason, setBuyErrorReason] = useState<'NETWORK' | 'STOCK'>('STOCK')
  const [lastPurchase, setLastPurchase] = useState<{ variantName: string; quantity: number } | undefined>(
    undefined,
  )

  const fetchProduct = useCallback(() => {
    if (!productId) return

    productService
      .findById(productId)
      .then((result) => {
        if (result) {
          setProduct(result)
          setStatus('found')
          setSelectedVariantId(undefined)
        } else {
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

  const selectedVariant = product?.variants.find((variant) => variant.id === selectedVariantId)

  function handleBuy() {
    if (!selectedVariant) return

    setBuyStatus('loading')
    setBuyErrorMessage('')

    purchaseService
      .buy(selectedVariant.id, 1)
      .then((confirmation) => {
        setBuyStatus('success')
        setLastPurchase({ variantName: selectedVariant.name, quantity: confirmation.quantity })
        setProduct((current) => {
          if (!current) return current
          return {
            ...current,
            variants: current.variants.map((variant) =>
              variant.id === confirmation.variantId
                ? {
                    ...variant,
                    stockQuantity: confirmation.remainingStock,
                    stockStatus: getStockStatus(confirmation.remainingStock),
                  }
                : variant,
            ),
          }
        })
      })
      .catch((err: PurchaseError) => {
        setBuyErrorMessage(err.message)
        setBuyErrorReason(err.reason)
        setBuyStatus('error')
      })
  }

  return (
    <section className="p-6">
      {status === 'loading' && <LoadingState message="Loading product..." />}

      {status === 'not-found' && <EmptyState message="Product not found." />}

      {status === 'error' && <ErrorState message={errorMessage} onRetry={handleRetry} />}

      {status === 'found' && product && (
        <>
          <h1 className="mb-2 text-2xl font-semibold">{product.name}</h1>

          <div className="mb-6 rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{product.categoryName}</p>
            <p className="mt-2 text-gray-700">{product.description}</p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">Variants</h2>
            {product.variants.length === 0 ? (
              <EmptyState message="This product has no active variants right now." />
            ) : (
              <ul className="flex flex-col gap-2">
                {product.variants.map((variant) => {
                  const isSelected = variant.id === selectedVariantId
                  const isOutOfStock = variant.stockStatus === 'OUT_OF_STOCK'

                  return (
                    <li
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariantId(variant.id)
                        setBuyStatus('idle')
                        setBuyErrorMessage('')
                      }}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      } ${isOutOfStock ? 'opacity-60' : ''}`}
                    >
                      <span className="text-sm text-gray-700">{variant.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">
                          ${variant.price.toFixed(2)}
                        </span>
                        <StockStatusBadge status={variant.stockStatus} />
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {selectedVariant && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-gray-700">
                You are about to buy: <strong>{selectedVariant.name}</strong>, $
                {selectedVariant.price.toFixed(2)}
              </p>

              {!user && (
                <div className="mt-3 rounded-md bg-gray-50 p-3">
                  <p className="mb-2 text-sm text-gray-600">Log in to buy this item.</p>
                  <Button onClick={() => navigate('/login')}>Log in to buy</Button>
                </div>
              )}

              {user && (
                <div className="mt-3">
                  <Button
                    onClick={handleBuy}
                    disabled={selectedVariant.stockStatus === 'OUT_OF_STOCK'}
                    loading={buyStatus === 'loading'}
                  >
                    {selectedVariant.stockStatus === 'OUT_OF_STOCK' ? 'Out of stock' : 'Buy'}
                  </Button>

                  {buyStatus === 'error' && (
                    <div
                      className={`mt-2 flex items-center justify-between rounded-md p-2 text-sm ${
                        buyErrorReason === 'NETWORK'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      <span>{buyErrorMessage}</span>
                      <div className="ml-3 flex items-center gap-3">
                        {buyErrorReason === 'NETWORK' && (
                          <button type="button" onClick={handleBuy} className="font-medium underline">
                            Retry
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setBuyStatus('idle')}
                          aria-label="Dismiss"
                          className="font-bold"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}

                  {buyStatus === 'success' && lastPurchase && (
                    <div className="mt-2 flex items-center justify-between rounded-md bg-green-50 p-2 text-sm text-green-700">
                      <span>
                        Purchased {lastPurchase.quantity} × {lastPurchase.variantName} — confirmed!
                      </span>
                      <button
                        type="button"
                        onClick={() => setBuyStatus('idle')}
                        aria-label="Dismiss"
                        className="ml-3 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default ProductDetail
