import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Input from './Input.tsx'
import TextArea from './TextArea.tsx'
import Select from './Select.tsx'
import Button from './Button.tsx'
import { categoryService } from '../services/categoryService.ts'
import type { Category } from '../models/types.ts'

export interface ProductFormValues {
  name: string
  description: string
  categoryId: string
}

export interface ProductFormErrors {
  name?: string
  description?: string
  categoryId?: string
}

function validate(values: ProductFormValues): ProductFormErrors {
  const validationErrors: ProductFormErrors = {}
  if (!values.name.trim()) validationErrors.name = 'Name is required'
  if (!values.description.trim()) validationErrors.description = 'Description is required'
  if (!values.categoryId) validationErrors.categoryId = 'Category is required'
  return validationErrors
}

interface ProductFormProps {
  values: ProductFormValues
  onChange: (values: ProductFormValues) => void
  onSubmit: (values: ProductFormValues) => void
  errors?: ProductFormErrors
  submitLabel?: string
  submitting?: boolean
}

function ProductForm({
  values,
  onChange,
  onSubmit,
  errors,
  submitLabel = 'Save',
  submitting = false,
}: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [validationErrors, setValidationErrors] = useState<ProductFormErrors>({})

  useEffect(() => {
    categoryService.find().then(setCategories)
  }, [])

  const fieldErrors: ProductFormErrors = { ...errors, ...validationErrors }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextValidationErrors = validate(values)
    setValidationErrors(nextValidationErrors)
    if (Object.keys(nextValidationErrors).length > 0) return
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Name"
        value={values.name}
        onChange={(e) => onChange({ ...values, name: e.target.value })}
        error={fieldErrors.name}
      />

      <TextArea
        label="Description"
        value={values.description}
        onChange={(e) => onChange({ ...values, description: e.target.value })}
        error={fieldErrors.description}
      />

      <Select
        label="Category"
        value={values.categoryId}
        onChange={(e) => onChange({ ...values, categoryId: e.target.value })}
        options={categories.map((category) => ({ label: category.name, value: category.id }))}
        error={fieldErrors.categoryId}
      />

      <Button type="submit" loading={submitting}>
        {submitLabel}
      </Button>
    </form>
  )
}

export default ProductForm
