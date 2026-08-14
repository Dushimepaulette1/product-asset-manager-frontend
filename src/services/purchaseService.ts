import { mockVariants } from '../mocks/mockVariants.ts'
import { getStockStatus } from '../models/types.ts'
import { resolveAfterDelay, rejectAfterDelay } from './mockApi.ts'

interface PurchaseOptions {
  simulateError?: boolean
}

interface PurchaseConfirmation {
  variantId: string
  quantity: number
  remainingStock: number
}

export const purchaseService = {
  buy(
    variantId: string,
    quantity: number,
    options: PurchaseOptions = {},
  ): Promise<PurchaseConfirmation> {
    if (options.simulateError) {
      return rejectAfterDelay('Network error - please try again')
    }

    if (quantity < 1) {
      return rejectAfterDelay('Quantity must be at least 1')
    }

    const variant = mockVariants.find((v) => v.id === variantId)
    if (!variant) {
      return rejectAfterDelay('Variant not found')
    }

    if (getStockStatus(variant.stockQuantity) === 'OUT_OF_STOCK') {
      return rejectAfterDelay('This variant is out of stock')
    }

    if (quantity > variant.stockQuantity) {
      return rejectAfterDelay(`Only ${variant.stockQuantity} left in stock`)
    }

    variant.stockQuantity -= quantity

    return resolveAfterDelay({
      variantId: variant.id,
      quantity,
      remainingStock: variant.stockQuantity,
    })
  },
}
