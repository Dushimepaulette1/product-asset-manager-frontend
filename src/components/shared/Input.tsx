import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

function Input({ label, error, id, className = '', ...rest }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
        {label}
      </label>
      <input
        id={inputId}
        className={`rounded-xl border bg-white/80 px-3.5 py-2.5 text-zinc-900 outline-none transition-colors focus:border-zinc-900 ${error ? 'border-red-400' : 'border-zinc-200'} ${className}`}
        {...rest}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default Input
