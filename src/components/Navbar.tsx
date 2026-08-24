import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.ts'
import Badge from './Badge.tsx'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <NavLink to="/" end className="font-semibold text-gray-900">
        Product Listing
      </NavLink>

      <ul className="flex items-center gap-4">
        {user ? (
          <>
            {user.role === 'ADMIN' && (
              <li>
                <NavLink to="/admin/products" className="text-sm text-gray-600 hover:text-gray-900">
                  Admin Product Management
                </NavLink>
              </li>
            )}
            <li className="flex items-center gap-2 text-sm text-gray-700">
              {user.name}
              <Badge label={user.role} color={user.role === 'ADMIN' ? 'purple' : 'blue'} />
            </li>
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
