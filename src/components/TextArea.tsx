import { useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

function TextArea({ label, error, id, className = '', ...rest }: TextAreaProps) {
  const generatedId = useId()
  const textAreaId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={textAreaId} className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
        {label}
      </label>
      <textarea
        id={textAreaId}
        className={`rounded-xl border bg-white/80 px-3.5 py-2.5 text-zinc-900 outline-none transition-colors focus:border-zinc-900 ${error ? 'border-red-400' : 'border-zinc-200'} ${className}`}
        {...rest}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default TextArea
