import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { productService } from '../../services/productService.ts'
import ProductForm from '../../components/ProductForm.tsx'
import type { ProductFormValues } from '../../components/ProductForm.tsx'
import LoadingState from '../../components/LoadingState.tsx'
import ErrorState from '../../components/ErrorState.tsx'

type LoadStatus = 'loading' | 'found' | 'error'

function AdminEditProduct() {
  const { productId } = useParams()
  const [values, setValues] = useState<ProductFormValues>({
    name: '',
    description: '',
    categoryId: '',
  })
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading')
  const [loadErrorMessage, setLoadErrorMessage] = useState('')

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

  return (
    <section className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Edit Product</h1>

      {loadStatus === 'loading' && <LoadingState message="Loading product..." />}

      {loadStatus === 'error' && <ErrorState message={loadErrorMessage} onRetry={handleRetry} />}

      {loadStatus === 'found' && (
        <ProductForm values={values} onChange={setValues} onSubmit={() => {}} submitLabel="Save Changes" />
      )}
    </section>
  )
}

export default AdminEditProduct
