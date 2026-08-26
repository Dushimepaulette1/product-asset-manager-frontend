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
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/70 px-6 py-4 backdrop-blur-md">
      <NavLink to="/" end className="font-display text-lg font-semibold tracking-tight text-zinc-900">
        Shop
      </NavLink>

      <ul className="flex items-center gap-5">
        {user ? (
          <>
            {user.role === 'ADMIN' && (
              <li>
                <NavLink
                  to="/admin/products"
                  className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
                >
                  Admin Product Management
                </NavLink>
              </li>
            )}
            <li className="flex items-center gap-2 text-sm text-zinc-700">
              {user.name}
              <Badge label={user.role} color={user.role === 'ADMIN' ? 'purple' : 'blue'} />
            </li>
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink
              to="/login"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
