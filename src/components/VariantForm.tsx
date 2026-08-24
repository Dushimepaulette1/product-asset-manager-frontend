import { useState } from 'react'
import type { FormEvent } from 'react'
import Input from './Input.tsx'
import Button from './Button.tsx'

export interface VariantFormValues {
  name: string
  sku: string
  price: string
  stockQuantity: string
}

export interface VariantFormErrors {
  name?: string
  price?: string
  stockQuantity?: string
}

function validate(values: VariantFormValues): VariantFormErrors {
  const errors: VariantFormErrors = {}

  if (!values.name.trim()) errors.name = 'Name is required'

  const price = Number(values.price)
  if (!values.price.trim() || Number.isNaN(price) || price <= 0) {
    errors.price = 'Price must be a positive number'
  }

  const stockQuantity = Number(values.stockQuantity)
  if (
    !values.stockQuantity.trim() ||
    Number.isNaN(stockQuantity) ||
    stockQuantity < 0 ||
    !Number.isInteger(stockQuantity)
  ) {
    errors.stockQuantity = 'Stock quantity must be zero or a positive whole number'
  }

  return errors
}

interface VariantFormProps {
  values: VariantFormValues
  onChange: (values: VariantFormValues) => void
  onSubmit: (values: VariantFormValues) => void
  onCancel: () => void
  submitLabel?: string
  submitting?: boolean
}

function VariantForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  submitLabel = 'Save Variant',
  submitting = false,
}: VariantFormProps) {
  const [validationErrors, setValidationErrors] = useState<VariantFormErrors>({})

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextValidationErrors = validate(values)
    setValidationErrors(nextValidationErrors)
    if (Object.keys(nextValidationErrors).length > 0) return
    onSubmit(values)
  }

  function handleFieldChange(nextValues: VariantFormValues) {
    onChange(nextValues)

    const stillInvalid = validate(nextValues)
    setValidationErrors((current) => {
      const next = { ...current }
      for (const field of Object.keys(current) as (keyof VariantFormErrors)[]) {
        if (!stillInvalid[field]) delete next[field]
      }
      return next
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4">
      <Input
        label="Name"
        value={values.name}
        onChange={(e) => handleFieldChange({ ...values, name: e.target.value })}
        error={validationErrors.name}
      />

      <Input
        label="SKU (optional)"
        value={values.sku}
        onChange={(e) => handleFieldChange({ ...values, sku: e.target.value })}
      />

      <Input
        label="Price"
        type="number"
        value={values.price}
        onChange={(e) => handleFieldChange({ ...values, price: e.target.value })}
        error={validationErrors.price}
      />

      <Input
        label="Stock quantity"
        type="number"
        value={values.stockQuantity}
        onChange={(e) => handleFieldChange({ ...values, stockQuantity: e.target.value })}
        error={validationErrors.stockQuantity}
      />

      <div className="flex gap-2">
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default VariantForm
