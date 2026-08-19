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
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              className="border-b border-gray-200 px-4 py-2 font-medium text-gray-500"
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
            className={onItemClick ? 'cursor-pointer hover:bg-gray-50' : undefined}
          >
            {columns.map((column, index) => (
              <td key={index} className="border-b border-gray-100 px-4 py-2">
                {column.render(item)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DataTable
