import type { UserRole } from '../models/types.ts'

export function getPostLoginRedirect(role: UserRole): string {
  return role === 'ADMIN' ? '/admin/products' : '/'
}
