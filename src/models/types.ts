export interface Category {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  description: string
  categoryId: string
  categoryName: string
  createdAt: string
  updatedAt: string
}

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'

export interface Variant {
  id: string
  productId: string
  name: string
  sku: string
  price: number
  stockQuantity: number
  isActive: boolean
}

export function getStockStatus(stockQuantity: number): StockStatus {
  if (stockQuantity === 0) return 'OUT_OF_STOCK'
  if (stockQuantity <= 10) return 'LOW_STOCK'
  return 'IN_STOCK'
}

export interface VariantWithStockStatus extends Variant {
  stockStatus: StockStatus
}

export interface ProductDetail extends Product {
  variants: VariantWithStockStatus[]
}

export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
}
