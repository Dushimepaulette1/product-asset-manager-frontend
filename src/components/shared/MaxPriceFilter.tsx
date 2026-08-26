import type { ChangeEvent } from 'react'
import Input from './Input.tsx'
import { parseMaxPriceInput } from './parseMaxPriceInput.ts'

interface MaxPriceFilterProps {
  value: number | undefined
  onChange: (value: number | undefined) => void
}

function MaxPriceFilter({ value, onChange }: MaxPriceFilterProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const result = parseMaxPriceInput(e.target.value)
    if (result === null) return
    onChange(result)
  }

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <Input
          label="Max price"
          type="number"
          min={0}
          placeholder="No limit"
          value={value ?? ''}
          onChange={handleChange}
        />
      </div>
      {value !== undefined && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="pb-2 text-sm text-zinc-500 hover:text-zinc-800"
        >
          Clear
        </button>
      )}
    </div>
  )
}

export default MaxPriceFilter
