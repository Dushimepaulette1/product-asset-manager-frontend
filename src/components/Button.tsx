import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
}

function Button({
  variant = 'primary',
  loading = false,
  disabled,
  type = 'button',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const variantClasses =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`rounded-md px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses} ${className}`}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}

export default Button
