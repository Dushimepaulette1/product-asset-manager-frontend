import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService.ts'
import { categoryService } from '../../services/categoryService.ts'
import type { Category } from '../../models/types.ts'
import ProductForm from '../../components/ProductForm.tsx'
import type { ProductFormValues } from '../../components/ProductForm.tsx'
import Button from '../../components/Button.tsx'

type SubmitStatus = 'idle' | 'loading' | 'error'

function AdminCreateProduct() {
  const navigate = useNavigate()
  const [values, setValues] = useState<ProductFormValues>({
    name: '',
    description: '',
    categoryId: '',
    imageUrl: '',
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    categoryService.find().then(setCategories)
  }, [])

  function handleSubmit(formValues: ProductFormValues) {
    const category = categories.find((c) => c.id === formValues.categoryId)
    if (!category) {
      setErrorMessage('Selected category could not be found.')
      setSubmitStatus('error')
      return
    }

    setSubmitStatus('loading')
    setErrorMessage('')

    productService
      .create({
        name: formValues.name,
        description: formValues.description,
        categoryId: category.id,
        categoryName: category.name,
        imageUrl: formValues.imageUrl.trim() || undefined,
      })
      .then((created) => {
        navigate(`/admin/products/${created.id}/edit`)
      })
      .catch((err: Error) => {
        setErrorMessage(err.message)
        setSubmitStatus('error')
      })
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-10">
      <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">Admin</p>
      <h1 className="mt-2 mb-8 font-display text-3xl font-semibold tracking-tight text-zinc-900">
        Create Product
      </h1>

      <ProductForm
        values={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        categories={categories}
        submitting={submitStatus === 'loading'}
        submitLabel="Create Product"
      />

      {submitStatus === 'error' && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}

      <div className="mt-4">
        <Button variant="secondary" onClick={() => navigate('/admin/products')}>
          Cancel
        </Button>
      </div>
    </section>
  )
}

export default AdminCreateProduct
