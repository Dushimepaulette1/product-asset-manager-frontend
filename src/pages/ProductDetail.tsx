import { useCallback, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { productService } from '../services/productService.ts'
import { purchaseService } from '../services/purchaseService.ts'
import type { PurchaseError } from '../services/purchaseService.ts'
import { getStockStatus } from '../models/types.ts'
import LoadingState from '../components/shared/LoadingState.tsx'
import EmptyState from '../components/shared/EmptyState.tsx'
import ErrorState from '../components/shared/ErrorState.tsx'
import StockStatusBadge from '../components/shared/StockStatusBadge.tsx'
import ProductImage from '../components/shared/ProductImage.tsx'
import Button from '../components/shared/Button.tsx'
import { useAuth } from '../context/useAuth.ts'
import { useAsync } from '../hooks/useAsync.ts'

type BuyStatus = 'idle' | 'loading' | 'success' | 'error'

function ProductDetail() {
  const { user } = useAuth()
  const { productId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined)
  const [buyStatus, setBuyStatus] = useState<BuyStatus>('idle')
  const [buyErrorMessage, setBuyErrorMessage] = useState('')
  const [buyErrorReason, setBuyErrorReason] = useState<'NETWORK' | 'STOCK'>('STOCK')
  const [lastPurchase, setLastPurchase] = useState<{ variantName: string; quantity: number } | undefined>(
    undefined,
  )

  const fetchProduct = useCallback(() => {
    if (!productId) return Promise.resolve(undefined)

    return productService.findById(productId).then((result) => {
      setSelectedVariantId(undefined)
      return result
    })
  }, [productId])

  const { data: product, setData: setProduct, status, errorMessage, retry } = useAsync(fetchProduct)

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
    <section className="mx-auto max-w-5xl px-6 py-10">
      {status === 'loading' && <LoadingState message="Loading product..." />}

      {status === 'success' && !product && <EmptyState message="Product not found." />}

      {status === 'error' && <ErrorState message={errorMessage} onRetry={retry} />}

      {status === 'success' && product && (
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-3xl border border-zinc-200">
            <ProductImage imageUrl={product.imageUrl} name={product.name} className="h-full w-full" />
          </div>

          <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-900">
            {product.name}
          </h1>

          <div className="mt-6 mb-8 rounded-2xl border border-zinc-200 bg-white/70 p-5">
            <p className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
              {product.categoryName}
            </p>
            <p className="mt-2 text-zinc-700">{product.description}</p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">Variants</h2>
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
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                        isSelected ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'
                      } ${isOutOfStock ? 'opacity-60' : ''}`}
                    >
                      <span className="text-sm text-zinc-700">{variant.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-zinc-900">
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

          {selectedVariant && user?.role === 'ADMIN' && (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-white/70 p-5">
              <p className="text-sm text-zinc-600">
                Selected <strong>{selectedVariant.name}</strong> — ${selectedVariant.price.toFixed(2)}.
                Manage pricing and stock from the admin product page.
              </p>
            </div>
          )}

          {selectedVariant && user?.role !== 'ADMIN' && (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-white/70 p-5">
              <p className="text-sm text-zinc-700">
                You are about to buy: <strong>{selectedVariant.name}</strong>, $
                {selectedVariant.price.toFixed(2)}
              </p>

              {!user && (
                <div className="mt-3 rounded-xl bg-zinc-50 p-3">
                  <p className="mb-2 text-sm text-zinc-600">Log in to buy this item.</p>
                  <Button onClick={() => navigate('/login', { state: { from: location } })}>
                    Log in to buy
                  </Button>
                </div>
              )}

              {user?.role === 'USER' && (
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
                      className={`mt-2 flex items-center justify-between rounded-xl p-3 text-sm ${
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
                    <div className="mt-2 flex items-center justify-between rounded-xl bg-green-50 p-3 text-sm text-green-700">
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
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductDetail
