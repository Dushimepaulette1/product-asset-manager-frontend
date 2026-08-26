import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService.ts'
import { categoryService } from '../../services/categoryService.ts'
import { variantService } from '../../services/variantService.ts'
import type {
  Category,
  ProductDetail as ProductDetailData,
  VariantWithStockStatus,
} from '../../models/types.ts'
import { getStockStatus } from '../../models/types.ts'
import ProductForm from '../shared/ProductForm.tsx'
import type { ProductFormValues } from '../shared/ProductForm.tsx'
import VariantForm from '../shared/VariantForm.tsx'
import type { VariantFormValues } from '../shared/VariantForm.tsx'
import LoadingState from '../shared/LoadingState.tsx'
import ErrorState from '../shared/ErrorState.tsx'
import EmptyState from '../shared/EmptyState.tsx'
import StockStatusBadge from '../shared/StockStatusBadge.tsx'
import Button from '../shared/Button.tsx'

type LoadStatus = 'loading' | 'found' | 'error'
type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

const EMPTY_VARIANT_VALUES: VariantFormValues = { name: '', sku: '', price: '', stockQuantity: '' }

function AdminEditProduct() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductDetailData | undefined>(undefined)
  const [values, setValues] = useState<ProductFormValues>({
    name: '',
    description: '',
    categoryId: '',
    imageUrl: '',
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading')
  const [loadErrorMessage, setLoadErrorMessage] = useState('')
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [submitErrorMessage, setSubmitErrorMessage] = useState('')

  const [variantFormMode, setVariantFormMode] = useState<'closed' | 'add' | 'edit'>('closed')
  const [variantFormValues, setVariantFormValues] = useState<VariantFormValues>(EMPTY_VARIANT_VALUES)
  const [editingVariantId, setEditingVariantId] = useState<string | undefined>(undefined)
  const [variantSubmitStatus, setVariantSubmitStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [variantSubmitErrorMessage, setVariantSubmitErrorMessage] = useState('')

  const fetchProduct = useCallback(() => {
    if (!productId) return

    productService
      .findById(productId)
      .then((result) => {
        if (result) {
          setProduct(result)
          setValues({
            name: result.name,
            description: result.description,
            categoryId: result.categoryId,
            imageUrl: result.imageUrl ?? '',
          })
          setLoadStatus('found')
        } else {
          setLoadErrorMessage('Product not found.')
          setLoadStatus('error')
        }
      })
      .catch((err: Error) => {
        setLoadErrorMessage(err.message)
        setLoadStatus('error')
      })
  }, [productId])

  function handleRetry() {
    setLoadStatus('loading')
    fetchProduct()
  }

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  useEffect(() => {
    categoryService.find().then(setCategories)
  }, [])

  function handleSubmit(formValues: ProductFormValues) {
    if (!productId) return

    const category = categories.find((c) => c.id === formValues.categoryId)
    if (!category) {
      setSubmitErrorMessage('Selected category could not be found.')
      setSubmitStatus('error')
      return
    }

    setSubmitStatus('loading')
    setSubmitErrorMessage('')

    productService
      .update(productId, {
        name: formValues.name,
        description: formValues.description,
        categoryId: category.id,
        categoryName: category.name,
        imageUrl: formValues.imageUrl.trim() || undefined,
      })
      .then(() => {
        setSubmitStatus('success')
      })
      .catch((err: Error) => {
        setSubmitErrorMessage(err.message)
        setSubmitStatus('error')
      })
  }

  function handleAddVariantClick() {
    setVariantFormValues(EMPTY_VARIANT_VALUES)
    setVariantFormMode('add')
    setVariantSubmitStatus('idle')
  }

  function handleVariantRowClick(variant: VariantWithStockStatus) {
    setVariantFormValues({
      name: variant.name,
      sku: variant.sku,
      price: variant.price.toString(),
      stockQuantity: variant.stockQuantity.toString(),
    })
    setEditingVariantId(variant.id)
    setVariantFormMode('edit')
    setVariantSubmitStatus('idle')
  }

  function handleVariantSubmit(formValues: VariantFormValues) {
    if (!productId) return

    setVariantSubmitStatus('loading')
    setVariantSubmitErrorMessage('')

    const data = {
      name: formValues.name,
      sku: formValues.sku,
      price: Number(formValues.price),
      stockQuantity: Number(formValues.stockQuantity),
      isActive: true,
    }

    const request =
      variantFormMode === 'edit' && editingVariantId
        ? variantService.update(editingVariantId, data)
        : variantService.create(productId, data)

    request
      .then((savedVariant) => {
        if (!savedVariant) return

        const updatedVariant: VariantWithStockStatus = {
          ...savedVariant,
          stockStatus: getStockStatus(savedVariant.stockQuantity),
        }

        setProduct((current) => {
          if (!current) return current
          const exists = current.variants.some((v) => v.id === updatedVariant.id)
          const variants = exists
            ? current.variants.map((v) => (v.id === updatedVariant.id ? updatedVariant : v))
            : [...current.variants, updatedVariant]
          return { ...current, variants }
        })

        setVariantFormMode('closed')
        setVariantSubmitStatus('idle')
      })
      .catch((err: Error) => {
        setVariantSubmitErrorMessage(err.message)
        setVariantSubmitStatus('error')
      })
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-10">
      <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">Admin</p>
      <h1 className="mt-2 mb-8 font-display text-3xl font-semibold tracking-tight text-zinc-900">
        Edit Product
      </h1>

      {loadStatus === 'loading' && <LoadingState message="Loading product..." />}

      {loadStatus === 'error' && <ErrorState message={loadErrorMessage} onRetry={handleRetry} />}

      {loadStatus === 'found' && product && (
        <>
          <ProductForm
            values={values}
            onChange={setValues}
            onSubmit={handleSubmit}
            categories={categories}
            submitting={submitStatus === 'loading'}
            submitLabel="Save Changes"
          />

          {submitStatus === 'error' && (
            <p className="mt-2 text-sm text-red-600">{submitErrorMessage}</p>
          )}

          {submitStatus === 'success' && (
            <p className="mt-2 text-sm text-green-600">Changes saved!</p>
          )}

          <div className="mt-4">
            <Button variant="secondary" onClick={() => navigate('/admin/products')}>
              Back to Product List
            </Button>
          </div>

          <div className="mt-10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900">Variants</h2>
              <Button onClick={handleAddVariantClick}>Add Variant</Button>
            </div>

            {variantFormMode !== 'closed' && (
              <div className="mb-4">
                <VariantForm
                  values={variantFormValues}
                  onChange={setVariantFormValues}
                  onSubmit={handleVariantSubmit}
                  onCancel={() => setVariantFormMode('closed')}
                  submitting={variantSubmitStatus === 'loading'}
                  submitLabel={variantFormMode === 'edit' ? 'Save Variant' : 'Add Variant'}
                />
                {variantSubmitStatus === 'error' && (
                  <p className="mt-2 text-sm text-red-600">{variantSubmitErrorMessage}</p>
                )}
              </div>
            )}

            {product.variants.length === 0 ? (
              <EmptyState message="No variants yet — Add one" />
            ) : (
              <ul className="flex flex-col gap-2">
                {product.variants.map((variant) => (
                  <li
                    key={variant.id}
                    onClick={() => handleVariantRowClick(variant)}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 p-4 transition-colors hover:border-zinc-300"
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
        </>
      )}
    </section>
  )
}

export default AdminEditProduct
