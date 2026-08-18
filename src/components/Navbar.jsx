import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="masthead">
      <div className="masthead-main container">
        <h1 className="wordmark">
          Today<span className="dot">●</span>NEWS
        </h1>
        <span className="tagline">DAILY WITH FRESH NEWS.</span>
      </div>

      <nav className="nav container linestyle" aria-label="Primary">
        <ul>
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
              Contact
            </NavLink>
          </li>
          {user ? (
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  font: "inherit",
                  padding: 0,
                }}
              >
                Log Out
              </button>
            </li>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
                  Log In
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
        <span className="nav-tag">
          {user ? `Signed in as ${user.name}` : "Trusted by 40,000 morning readers"}
        </span>
      </nav>
    </header>
  );
}

export default Navbar;
