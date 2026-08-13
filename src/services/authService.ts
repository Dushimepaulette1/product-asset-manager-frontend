import { mockUsers } from '../mocks/mockUsers.ts'
import type { AuthTokenPayload, AuthUser } from '../models/types.ts'
import { resolveAfterDelay, rejectAfterDelay } from './mockApi.ts'

const STORAGE_KEY = 'auth_token'

function encodeToken(payload: AuthTokenPayload): string {
  const body = btoa(JSON.stringify(payload))
  return `mock.${body}.signature`
}

function decodeToken(token: string): AuthTokenPayload | undefined {
  const parts = token.split('.')
  if (parts.length !== 3) return undefined

  try {
    return JSON.parse(atob(parts[1])) as AuthTokenPayload
  } catch {
    return undefined
  }
}

function persistToken(token: string) {
  localStorage.setItem(STORAGE_KEY, token)
}

function toAuthUser(payload: AuthTokenPayload): AuthUser {
  const matchedUser = mockUsers.find((u) => u.id === payload.sub)
  return {
    name: matchedUser?.name ?? payload.email,
    email: payload.email,
    role: payload.role,
  }
}

interface LoginOptions {
  simulateNetworkError?: boolean
}

export const authService = {
  login(
    email: string,
    password: string,
    options: LoginOptions = {},
  ): Promise<{ token: string; user: AuthUser }> {
    if (options.simulateNetworkError) {
      return rejectAfterDelay('Network error - please try again')
    }

    const matchedUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    )

    if (!matchedUser) {
      return rejectAfterDelay('Invalid email or password')
    }

    const payload: AuthTokenPayload = {
      sub: matchedUser.id,
      email: matchedUser.email,
      role: matchedUser.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }

    const token = encodeToken(payload)
    persistToken(token)

    return resolveAfterDelay({ token, user: toAuthUser(payload) })
  },

  decodeToken,

  logout(): void {
    localStorage.removeItem(STORAGE_KEY)
  },

  getStoredToken(): string | null {
    return localStorage.getItem(STORAGE_KEY)
  },

  getCurrentUser(): AuthUser | undefined {
    const token = localStorage.getItem(STORAGE_KEY)
    if (!token) return undefined

    const payload = decodeToken(token)
    if (!payload || payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY)
      return undefined
    }

    return toAuthUser(payload)
  },
}
