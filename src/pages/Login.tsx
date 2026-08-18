import { useState } from 'react'
import type { FormEvent } from 'react'
import Input from '../components/Input.tsx'
import Button from '../components/Button.tsx'

interface LoginFormValues {
  email: string
  password: string
}

interface LoginFormErrors {
  email?: string
  password?: string
}

function validate(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {}
  if (!values.email.trim()) errors.email = 'Email is required'
  if (!values.password) errors.password = 'Password is required'
  return errors
}

function Login() {
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' })
  const [validationErrors, setValidationErrors] = useState<LoginFormErrors>({})

  function handleFieldChange(nextValues: LoginFormValues) {
    setValues(nextValues)

    const stillInvalid = validate(nextValues)
    setValidationErrors((current) => {
      const next = { ...current }
      for (const field of Object.keys(current) as (keyof LoginFormErrors)[]) {
        if (!stillInvalid[field]) delete next[field]
      }
      return next
    })
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextValidationErrors = validate(values)
    setValidationErrors(nextValidationErrors)
    if (Object.keys(nextValidationErrors).length > 0) return
  }

  return (
    <section className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Login</h1>

      <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-4">
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(e) => handleFieldChange({ ...values, email: e.target.value })}
          error={validationErrors.email}
        />

        <Input
          label="Password"
          type="password"
          value={values.password}
          onChange={(e) => handleFieldChange({ ...values, password: e.target.value })}
          error={validationErrors.password}
        />

        <Button type="submit">Log In</Button>
      </form>
    </section>
  )
}

export default Login
