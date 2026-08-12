import { createContext } from 'react'
import type { AuthUser } from '../models/types.ts'

export interface AuthContextValue {
  user: AuthUser | null
}

export const AuthContext = createContext<AuthContextValue>({ user: null })
