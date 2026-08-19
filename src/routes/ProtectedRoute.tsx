import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.ts'
import UnauthorizedPage from '../pages/UnauthorizedPage.tsx'
import type { UserRole } from '../models/types.ts'

interface ProtectedRouteProps {
  allowedRoles: UserRole[]
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <UnauthorizedPage />
  }

  return <Outlet />
}

export default ProtectedRoute
