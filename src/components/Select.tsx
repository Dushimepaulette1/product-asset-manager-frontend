import { useId } from 'react'
import type { SelectHTMLAttributes } from 'react'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
}

function Select({ label, options, error, id, className = '', ...rest }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
        {label}
      </label>
      <select
        id={selectId}
        className={`rounded-xl border bg-white/80 px-3.5 py-2.5 text-zinc-900 outline-none transition-colors focus:border-zinc-900 ${error ? 'border-red-400' : 'border-zinc-200'} ${className}`}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default Select
