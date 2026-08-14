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
    <div className="flex flex-col gap-1">
      <label htmlFor={textAreaId} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={textAreaId}
        className={`rounded-md border px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
        {...rest}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default TextArea
