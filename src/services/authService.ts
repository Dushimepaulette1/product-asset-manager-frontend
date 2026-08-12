import type { AuthTokenPayload } from '../models/types.ts'

export const authService = {
  decodeToken(token: string): AuthTokenPayload | undefined {
    const parts = token.split('.')
    if (parts.length !== 3) return undefined

    try {
      return JSON.parse(atob(parts[1])) as AuthTokenPayload
    } catch {
      return undefined
    }
  },
}
