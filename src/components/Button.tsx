import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400',
  secondary:
    'bg-white text-gray-900 border border-gray-300 hover:border-blue-400 active:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200',
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
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:pointer-events-none ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {loading ? <>{children}...</> : children}
    </button>
  )
}

export default Button
