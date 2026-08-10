import { NavLink } from "react-router-dom";
function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/products">Product List</NavLink>
        </li>
        <li>
          <NavLink to="/assets">Asset Library</NavLink>
        </li>
        <li>
          <NavLink to="/assets/review">Assets To Review</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
