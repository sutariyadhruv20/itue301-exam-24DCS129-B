import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-brand">
        <span>🏥</span> MedCare Plus
      </NavLink>

      <div className="nav-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          end
        >
          Home
        </NavLink>
        <NavLink 
          to="/doctors" 
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Doctors
        </NavLink>
        <NavLink 
          to="/booking" 
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Booking
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;