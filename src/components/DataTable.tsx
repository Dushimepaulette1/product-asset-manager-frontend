import type { ReactNode } from 'react'

interface DataTableColumn<T> {
  header: string
  render: (item: T) => ReactNode
}

interface DataTableProps<T> {
  items: T[]
  columns: DataTableColumn<T>[]
  getKey: (item: T) => string
  onItemClick?: (item: T) => void
}

function DataTable<T>({ items, columns, getKey, onItemClick }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/70">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="border-b border-zinc-200 px-5 py-3 text-xs font-semibold tracking-wide text-zinc-500 uppercase"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={getKey(item)}
              onClick={onItemClick ? () => onItemClick(item) : undefined}
              className={onItemClick ? 'cursor-pointer transition-colors hover:bg-zinc-50' : undefined}
            >
              {columns.map((column, index) => (
                <td key={index} className="border-b border-zinc-100 px-5 py-3">
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
