import { mockCategories } from '../mocks/mockCategories.ts'
import type { Category } from '../models/types.ts'
import { resolveAfterDelay } from './mockApi.ts'

export const categoryService = {
  find(): Promise<Category[]> {
    return resolveAfterDelay([...mockCategories])
  },
}
