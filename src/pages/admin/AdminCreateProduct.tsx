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
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    categoryService.find().then(setCategories)
  }, [])

  function handleSubmit(formValues: ProductFormValues) {
    const category = categories.find((c) => c.id === formValues.categoryId)

    if (!formValues.name.trim() || !formValues.description.trim() || !category) {
      setErrorMessage('Please fill out all fields.')
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
    <section className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Create Product</h1>

      <ProductForm
        values={values}
        onChange={setValues}
        onSubmit={handleSubmit}
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
