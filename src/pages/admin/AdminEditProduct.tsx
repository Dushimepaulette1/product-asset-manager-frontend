import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService.ts'
import { categoryService } from '../../services/categoryService.ts'
import type { Category, ProductDetail as ProductDetailData } from '../../models/types.ts'
import ProductForm from '../../components/ProductForm.tsx'
import type { ProductFormValues } from '../../components/ProductForm.tsx'
import VariantForm from '../../components/VariantForm.tsx'
import type { VariantFormValues } from '../../components/VariantForm.tsx'
import LoadingState from '../../components/LoadingState.tsx'
import ErrorState from '../../components/ErrorState.tsx'
import EmptyState from '../../components/EmptyState.tsx'
import StockStatusBadge from '../../components/StockStatusBadge.tsx'
import Button from '../../components/Button.tsx'

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
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading')
  const [loadErrorMessage, setLoadErrorMessage] = useState('')
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [submitErrorMessage, setSubmitErrorMessage] = useState('')

  const [variantFormMode, setVariantFormMode] = useState<'closed' | 'add' | 'edit'>('closed')
  const [variantFormValues, setVariantFormValues] = useState<VariantFormValues>(EMPTY_VARIANT_VALUES)

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
  }

  return (
    <section className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Edit Product</h1>

      {loadStatus === 'loading' && <LoadingState message="Loading product..." />}

      {loadStatus === 'error' && <ErrorState message={loadErrorMessage} onRetry={handleRetry} />}

      {loadStatus === 'found' && product && (
        <>
          <ProductForm
            values={values}
            onChange={setValues}
            onSubmit={handleSubmit}
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

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Variants</h2>
              <Button onClick={handleAddVariantClick}>Add Variant</Button>
            </div>

            {variantFormMode !== 'closed' && (
              <div className="mb-4">
                <VariantForm
                  values={variantFormValues}
                  onChange={setVariantFormValues}
                  onSubmit={() => {}}
                  onCancel={() => setVariantFormMode('closed')}
                  submitLabel={variantFormMode === 'edit' ? 'Save Variant' : 'Add Variant'}
                />
              </div>
            )}

            {product.variants.length === 0 ? (
              <EmptyState message="No variants yet — Add one" />
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
        </>
      )}
    </section>
  )
}

export default AdminEditProduct
