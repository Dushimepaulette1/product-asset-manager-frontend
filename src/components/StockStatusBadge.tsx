import Badge from './Badge.tsx'
import { stockStatusLabels } from '../models/types.ts'
import type { StockStatus } from '../models/types.ts'

const stockStatusColors: Record<StockStatus, 'green' | 'yellow' | 'red'> = {
  IN_STOCK: 'green',
  LOW_STOCK: 'yellow',
  OUT_OF_STOCK: 'red',
}

interface StockStatusBadgeProps {
  status: StockStatus
}

function StockStatusBadge({ status }: StockStatusBadgeProps) {
  return <Badge label={stockStatusLabels[status]} color={stockStatusColors[status]} />
}

export default StockStatusBadge
