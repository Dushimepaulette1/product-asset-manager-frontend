import { useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext.tsx'
import { authService } from '../services/authService.ts'
import type { AuthUser } from '../models/types.ts'

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCurrentUser() ?? null)

  async function login(email: string, password: string) {
    const { user: loggedInUser } = await authService.login(email, password)
    setUser(loggedInUser)
    return loggedInUser
  }

  function logout() {
    authService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export default AuthProvider
