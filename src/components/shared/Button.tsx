import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-zinc-900 text-white hover:bg-zinc-700 active:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400',
  secondary:
    'bg-transparent text-zinc-900 border border-zinc-300 hover:border-zinc-900 active:bg-zinc-50 disabled:bg-transparent disabled:text-zinc-400 disabled:border-zinc-200',
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
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:pointer-events-none ${variantClasses[variant]} ${className}`}
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
