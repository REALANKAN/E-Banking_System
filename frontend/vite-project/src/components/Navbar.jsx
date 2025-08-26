import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-black shadow-lg py-2">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold text-warning fs-4" to="/">
          🏦 E-Banking
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className="navbar-toggler border-0 text-warning" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-light px-3" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light px-3" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light px-3" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-warning px-3 fw-bold" to="/register">
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
