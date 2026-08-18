import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService.ts'
import { categoryService } from '../../services/categoryService.ts'
import type { Category } from '../../models/types.ts'
import ProductForm from '../../components/ProductForm.tsx'
import type { ProductFormValues } from '../../components/ProductForm.tsx'
import LoadingState from '../../components/LoadingState.tsx'
import ErrorState from '../../components/ErrorState.tsx'
import Button from '../../components/Button.tsx'

type LoadStatus = 'loading' | 'found' | 'error'
type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

function AdminEditProduct() {
  const { productId } = useParams()
  const navigate = useNavigate()
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

  const fetchProduct = useCallback(() => {
    if (!productId) return

    productService
      .findById(productId)
      .then((result) => {
        if (result) {
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

  return (
    <section className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Edit Product</h1>

      {loadStatus === 'loading' && <LoadingState message="Loading product..." />}

      {loadStatus === 'error' && <ErrorState message={loadErrorMessage} onRetry={handleRetry} />}

      {loadStatus === 'found' && (
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
            <h2 className="mb-2 text-lg font-semibold">Variants</h2>
            <p className="text-sm text-gray-500">Variant management coming soon.</p>
          </div>
        </>
      )}
    </section>
  )
}

export default AdminEditProduct
