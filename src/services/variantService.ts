import { mockVariants } from '../mocks/mockVariants.ts'
import type { Variant } from '../models/types.ts'
import { resolveAfterDelay } from './mockApi.ts'

export const variantService = {
  create(productId: string, data: Omit<Variant, 'id' | 'productId'>): Promise<Variant> {
    const newVariant: Variant = {
      ...data,
      id: crypto.randomUUID(),
      productId,
    }
    mockVariants.push(newVariant)
    return resolveAfterDelay(newVariant)
  },

  update(variantId: string, data: Partial<Omit<Variant, 'id' | 'productId'>>): Promise<Variant | undefined> {
    const index = mockVariants.findIndex((v) => v.id === variantId)
    if (index === -1) return resolveAfterDelay(undefined)

    mockVariants[index] = { ...mockVariants[index], ...data }
    return resolveAfterDelay(mockVariants[index])
  },
}
