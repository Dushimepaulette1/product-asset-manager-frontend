import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Input from '../components/Input.tsx'
import Button from '../components/Button.tsx'
import { useAuth } from '../context/useAuth.ts'
import { getPostLoginRedirect } from '../routes/postLoginRedirect.ts'

interface LoginFormValues {
  email: string
  password: string
}

interface LoginFormErrors {
  email?: string
  password?: string
}

interface LoginLocationState {
  from?: { pathname: string; search: string }
}

function validate(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {}
  if (!values.email.trim()) errors.email = 'Email is required'
  if (!values.password) errors.password = 'Password is required'
  return errors
}

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' })
  const [validationErrors, setValidationErrors] = useState<LoginFormErrors>({})
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [submitErrorMessage, setSubmitErrorMessage] = useState('')

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

    setSubmitStatus('loading')
    setSubmitErrorMessage('')

    login(values.email, values.password)
      .then((user) => {
        const state = location.state as LoginLocationState | null
        const from = state?.from
        const destination = from ? `${from.pathname}${from.search}` : getPostLoginRedirect(user.role)
        navigate(destination, { replace: true })
      })
      .catch((err: Error) => {
        setSubmitErrorMessage(err.message)
        setSubmitStatus('error')
      })
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

        <Button type="submit" loading={submitStatus === 'loading'}>
          Log In
        </Button>

        {submitStatus === 'error' && (
          <p className="text-sm text-red-600">{submitErrorMessage}</p>
        )}
      </form>
    </section>
  )
}

export default Login
