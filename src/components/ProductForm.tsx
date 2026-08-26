import { useState } from 'react'
import type { FormEvent } from 'react'
import Input from './Input.tsx'
import TextArea from './TextArea.tsx'
import Select from './Select.tsx'
import Button from './Button.tsx'
import type { Category } from '../models/types.ts'

export interface ProductFormValues {
  name: string
  description: string
  categoryId: string
  imageUrl: string
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
  categories: Category[]
  errors?: ProductFormErrors
  submitLabel?: string
  submitting?: boolean
}

function ProductForm({
  values,
  onChange,
  onSubmit,
  categories,
  errors,
  submitLabel = 'Save',
  submitting = false,
}: ProductFormProps) {
  const [validationErrors, setValidationErrors] = useState<ProductFormErrors>({})

  const fieldErrors: ProductFormErrors = { ...errors, ...validationErrors }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextValidationErrors = validate(values)
    setValidationErrors(nextValidationErrors)
    if (Object.keys(nextValidationErrors).length > 0) return
    onSubmit(values)
  }

  function handleFieldChange(nextValues: ProductFormValues) {
    onChange(nextValues)

    const stillInvalid = validate(nextValues)
    setValidationErrors((current) => {
      const next = { ...current }
      for (const field of Object.keys(current) as (keyof ProductFormErrors)[]) {
        if (!stillInvalid[field]) delete next[field]
      }
      return next
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white/70 p-6"
    >
      <Input
        label="Name"
        value={values.name}
        onChange={(e) => handleFieldChange({ ...values, name: e.target.value })}
        error={fieldErrors.name}
      />

      <TextArea
        label="Description"
        value={values.description}
        onChange={(e) => handleFieldChange({ ...values, description: e.target.value })}
        error={fieldErrors.description}
      />

      <Select
        label="Category"
        value={values.categoryId}
        onChange={(e) => handleFieldChange({ ...values, categoryId: e.target.value })}
        options={categories.map((category) => ({ label: category.name, value: category.id }))}
        error={fieldErrors.categoryId}
      />

      <Input
        label="Image URL (optional)"
        type="url"
        placeholder="https://..."
        value={values.imageUrl}
        onChange={(e) => handleFieldChange({ ...values, imageUrl: e.target.value })}
      />

      <Button type="submit" loading={submitting}>
        {submitLabel}
      </Button>
    </form>
  )
}

export default ProductForm
