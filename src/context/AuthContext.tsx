import { createContext } from 'react'

export type UserRole = 'USER' | 'ADMIN'

export interface AuthUser {
  email: string
  role: UserRole
}

export interface AuthContextValue {
  user: AuthUser | null
}

export const AuthContext = createContext<AuthContextValue>({ user: null })
