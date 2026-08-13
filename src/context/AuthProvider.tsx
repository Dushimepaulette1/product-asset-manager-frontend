import { useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext.tsx'
import { authService } from '../services/authService.ts'
import type { AuthUser } from '../models/types.ts'

function getInitialUser(): AuthUser | null {
  const token = authService.getStoredToken()
  if (!token) return null

  const payload = authService.decodeToken(token)
  if (!payload || payload.exp * 1000 <= Date.now()) {
    authService.logout()
    return null
  }

  return { email: payload.email, role: payload.role }
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getInitialUser)

  async function login(email: string, password: string) {
    const { user: loggedInUser } = await authService.login(email, password)
    setUser(loggedInUser)
  }

  function logout() {
    authService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export default AuthProvider
