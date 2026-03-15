import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">

        {/* Logo */}
        <span className="navbar-brand fw-bold text-danger">
          🚑 Ambulance System
        </span>

        {/* Toggle Button (Mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <div className="d-flex gap-2">

            <Link to="/book" className="btn btn-danger">
              Book Ambulance
            </Link>

            <Link to="/mybookings" className="btn btn-primary">
              My Bookings
            </Link>

            <Link to="/driver" className="btn btn-success">
              Driver Dashboard
            </Link>

            <Link to="/login" className="btn btn-dark">
              Login
            </Link>

            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>

          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;