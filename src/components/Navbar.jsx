import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaAmbulance, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaMapMarkerAlt, FaFileMedical, FaHome, FaUserCog, FaSun, FaMoon } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("driverId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin": return "Admin";
      case "driver": return "Driver";
      case "user": return "Patient";
      default: return "User";
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark glass-navbar sticky-top py-3">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4">
          <span style={{ color: "#ef4444" }} className="d-flex align-items-center">
            <FaAmbulance size={28} />
          </span>
          <span style={{ letterSpacing: "0.5px" }}>
            Life<span style={{ color: "#ef4444" }}>Line</span>
          </span>
        </Link>

        {/* Toggle Button (Mobile) */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          style={{ background: "rgba(255, 255, 255, 0.05)" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <ul className="navbar-nav align-items-lg-center gap-2 mt-3 mt-lg-0">
            {/* Home Link */}
            <li className="nav-item">
              <Link to="/" className="nav-link d-flex align-items-center gap-2 text-white-50 hover-white px-3 py-2 rounded-3">
                <FaHome size={16} /> Home
              </Link>
            </li>

            {token ? (
              <>
                {/* Admin Role Specific Link */}
                {userRole === "admin" && (
                  <li className="nav-item">
                    <Link to="/admin" className="nav-link d-flex align-items-center gap-2 text-white-50 hover-white px-3 py-2 rounded-3">
                      <FaUserCog size={16} /> Admin Panel
                    </Link>
                  </li>
                )}

                {/* Driver Role Specific Link */}
                {userRole === "driver" && (
                  <li className="nav-item">
                    <Link to="/driver" className="nav-link d-flex align-items-center gap-2 text-white-50 hover-white px-3 py-2 rounded-3">
                      <FaMapMarkerAlt size={16} /> Driver Console
                    </Link>
                  </li>
                )}

                {/* User Role Specific Links */}
                {userRole === "user" && (
                  <>
                    <li className="nav-item">
                      <Link to="/book" className="nav-link d-flex align-items-center gap-2 text-white-50 hover-white px-3 py-2 rounded-3">
                        <FaAmbulance size={16} /> Book Ambulance
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/mybookings" className="nav-link d-flex align-items-center gap-2 text-white-50 hover-white px-3 py-2 rounded-3">
                        <FaFileMedical size={16} /> My Bookings
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/sos" className="btn btn-premium-danger px-3 py-2 d-flex align-items-center gap-2 fs-6">
                        🚨 SOS Mode
                      </Link>
                    </li>
                  </>
                )}

                {/* User Identity Profile Badge */}
                <li className="nav-item ms-lg-2">
                  <span className="badge d-flex align-items-center gap-2 px-3 py-2 rounded-pill fs-6 fw-semibold" style={{ background: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(168, 85, 247, 0.3)", color: "#c084fc", fontSize: "0.85rem" }}>
                    👤 {userName || "User"} ({getRoleLabel(userRole)})
                  </span>
                </li>

                {/* Logout Button */}
                <li className="nav-item ms-lg-2">
                  <button
                    onClick={handleLogout}
                    className="btn btn-premium-outline px-3 py-2 d-flex align-items-center gap-2 w-100"
                  >
                    <FaSignOutAlt size={16} /> Logout
                  </button>
                </li>
              </>
            ) : (
              /* Non-authenticated Links */
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link d-flex align-items-center gap-2 text-white-50 hover-white px-3 py-2 rounded-3">
                    <FaSignInAlt size={16} /> Login
                  </Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link to="/register" className="btn btn-premium px-4 py-2 d-flex align-items-center gap-2 text-white text-decoration-none">
                    <FaUserPlus size={16} /> Register
                  </Link>
                </li>
              </>
            )}

            {/* Theme Toggle Button (For Everyone) */}
            <li className="nav-item ms-lg-2">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="btn btn-premium-outline p-2 d-flex align-items-center justify-content-center"
                style={{ width: "42px", height: "42px", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "rgba(255, 255, 255, 0.03)" }}
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? (
                  <FaSun size={18} style={{ color: "#fbbf24" }} />
                ) : (
                  <FaMoon size={18} style={{ color: "#38bdf8" }} />
                )}
              </button>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;