import Input from './Input.tsx'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <Input
          label="Search"
          placeholder="Search products by name"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="pb-2 text-sm text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      )}
    </div>
  )
}

export default SearchBar
