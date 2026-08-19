import { mockVariants } from '../mocks/mockVariants.ts'
import { getStockStatus } from '../models/types.ts'
import { resolveAfterDelay } from './mockApi.ts'

export type PurchaseErrorReason = 'NETWORK' | 'STOCK'

export interface PurchaseError extends Error {
  reason: PurchaseErrorReason
}

function rejectWithReason(message: string, reason: PurchaseErrorReason, ms = 400): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const error = new Error(message) as PurchaseError
      error.reason = reason
      reject(error)
    }, ms)
  })
}

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
      return rejectWithReason('Network error - please try again', 'NETWORK')
    }

    if (quantity < 1) {
      return rejectWithReason('Quantity must be at least 1', 'STOCK')
    }

    const variant = mockVariants.find((v) => v.id === variantId)
    if (!variant) {
      return rejectWithReason('Variant not found', 'STOCK')
    }

    if (getStockStatus(variant.stockQuantity) === 'OUT_OF_STOCK') {
      return rejectWithReason('This variant is out of stock', 'STOCK')
    }

    if (quantity > variant.stockQuantity) {
      return rejectWithReason(`Only ${variant.stockQuantity} left in stock`, 'STOCK')
    }

    variant.stockQuantity -= quantity

    return resolveAfterDelay({
      variantId: variant.id,
      quantity,
      remainingStock: variant.stockQuantity,
    })
  },
}
