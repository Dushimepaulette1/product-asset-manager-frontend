import { mockProducts } from '../mocks/mockProducts.ts'
import { mockVariants } from '../mocks/mockVariants.ts'
import type { Product, ProductDetail, ProductWithStartingPrice } from '../models/types.ts'
import { getStockStatus } from '../models/types.ts'
import { resolveAfterDelay, rejectAfterDelay } from './mockApi.ts'

interface ProductFindParams {
  keyword?: string
  maxPrice?: number
  simulateError?: boolean
}

function lowestActiveVariantPrice(productId: string): number | undefined {
  const activePrices = mockVariants
    .filter((variant) => variant.productId === productId && variant.isActive)
    .map((variant) => variant.price)

  return activePrices.length > 0 ? Math.min(...activePrices) : undefined
}

export const productService = {
  find(params: ProductFindParams = {}): Promise<ProductWithStartingPrice[]> {
    if (params.simulateError) {
      return rejectAfterDelay('Failed to load products')
    }

    const keyword = params.keyword?.trim().toLowerCase()

    const results = mockProducts
      .filter((product) => {
        const matchesKeyword = keyword ? product.name.toLowerCase().includes(keyword) : true
        if (!matchesKeyword) return false

        if (params.maxPrice === undefined) return true
        const lowestPrice = lowestActiveVariantPrice(product.id)
        return lowestPrice !== undefined && lowestPrice <= params.maxPrice
      })
      .map((product) => ({ ...product, startingPrice: lowestActiveVariantPrice(product.id) }))

    return resolveAfterDelay(results)
  },

  findById(id: string, options: { simulateError?: boolean } = {}): Promise<ProductDetail | undefined> {
    if (options.simulateError) {
      return rejectAfterDelay('Failed to load product')
    }

    const product = mockProducts.find((p) => p.id === id)
    if (!product) return resolveAfterDelay(undefined)

    const variants = mockVariants
      .filter((variant) => variant.productId === id && variant.isActive)
      .map((variant) => ({ ...variant, stockStatus: getStockStatus(variant.stockQuantity) }))

    return resolveAfterDelay({ ...product, variants })
  },

  create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const now = new Date().toISOString()
    const newProduct: Product = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    mockProducts.push(newProduct)
    return resolveAfterDelay(newProduct)
  },

  update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | undefined> {
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) return resolveAfterDelay(undefined)

    mockProducts[index] = { ...mockProducts[index], ...data, updatedAt: new Date().toISOString() }
    return resolveAfterDelay(mockProducts[index])
  },
}
