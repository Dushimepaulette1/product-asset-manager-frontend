import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext.tsx'

function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={{ user: null }}>{children}</AuthContext.Provider>
}

export default AuthProvider
