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

  useEffect(() => {
    categoryService.find().then(setCategories)
  }, [])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Name"
        value={values.name}
        onChange={(e) => onChange({ ...values, name: e.target.value })}
        error={errors?.name}
      />

      <TextArea
        label="Description"
        value={values.description}
        onChange={(e) => onChange({ ...values, description: e.target.value })}
        error={errors?.description}
      />

      <Select
        label="Category"
        value={values.categoryId}
        onChange={(e) => onChange({ ...values, categoryId: e.target.value })}
        options={categories.map((category) => ({ label: category.name, value: category.id }))}
        error={errors?.categoryId}
      />

      <Button type="submit" loading={submitting}>
        {submitLabel}
      </Button>
    </form>
  )
}

export default ProductForm
