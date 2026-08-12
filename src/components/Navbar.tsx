import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" end>
            Product Listing
          </NavLink>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
