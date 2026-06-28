import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { FaUser, FaPhoneAlt, FaLock, FaAmbulance, FaUserPlus } from "react-icons/fa";

function Register() {
  const [role, setRole] = useState("user"); // "user" or "driver"
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    ambulanceNumber: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (form.phone.length !== 10 || isNaN(form.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (role === "driver" && !form.ambulanceNumber) {
      toast.error("Ambulance Vehicle Number is required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        password: form.password,
        role: role,
        ...(role === "driver" && { ambulanceNumber: form.ambulanceNumber })
      };

      await API.post("/auth/register", payload);

      toast.success(`${role === "admin" ? "Admin" : role === "driver" ? "Driver" : "User"} Registered Successfully! 🚑`);
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: "85vh" }}>
      <div className="glass-card p-4 p-md-5" style={{ width: "100%", maxWidth: "440px" }}>
        
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="fw-extrabold text-white mb-2" style={{ fontSize: "2rem" }}>
            Create Account
          </h2>
          <p className="text-muted" style={{ fontSize: "0.9rem", fontFamily: "var(--font-secondary)" }}>
            Join our smart ambulance dispatch network.
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="role-tabs mb-4">
          <button
            type="button"
            className={`role-tab-btn ${role === "user" ? "active" : ""}`}
            onClick={() => setRole("user")}
            style={{ fontSize: "0.8rem" }}
          >
            🏥 Booker
          </button>
          <button
            type="button"
            className={`role-tab-btn ${role === "driver" ? "active" : ""}`}
            onClick={() => setRole("driver")}
            style={{ fontSize: "0.8rem" }}
          >
            🚑 Driver
          </button>
          <button
            type="button"
            className={`role-tab-btn ${role === "admin" ? "active" : ""}`}
            onClick={() => setRole("admin")}
            style={{ fontSize: "0.8rem" }}
          >
            ⚙️ Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label text-white-50 fw-semibold" style={{ fontSize: "0.85rem" }}>Full Name</label>
            <div className="input-group">
              <span className="input-group-text glass-input border-end-0 rounded-end-0 d-flex align-items-center justify-content-center" style={{ background: "rgba(20, 16, 28, 0.4)", width: "45px" }}>
                <FaUser size={14} className="text-muted" />
              </span>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="form-control glass-input border-start-0 rounded-start-0"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="mb-3">
            <label className="form-label text-white-50 fw-semibold" style={{ fontSize: "0.85rem" }}>Phone Number</label>
            <div className="input-group">
              <span className="input-group-text glass-input border-end-0 rounded-end-0 d-flex align-items-center justify-content-center" style={{ background: "rgba(20, 16, 28, 0.4)", width: "45px" }}>
                <FaPhoneAlt size={14} className="text-muted" />
              </span>
              <input
                type="tel"
                name="phone"
                placeholder="10-digit phone number"
                value={form.phone}
                onChange={handleChange}
                className="form-control glass-input border-start-0 rounded-start-0"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label text-white-50 fw-semibold" style={{ fontSize: "0.85rem" }}>Password</label>
            <div className="input-group">
              <span className="input-group-text glass-input border-end-0 rounded-end-0 d-flex align-items-center justify-content-center" style={{ background: "rgba(20, 16, 28, 0.4)", width: "45px" }}>
                <FaLock size={14} className="text-muted" />
              </span>
              <input
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                className="form-control glass-input border-start-0 rounded-start-0"
              />
            </div>
          </div>

          {/* Dynamic Ambulance Vehicle Number (Only for Driver) */}
          {role === "driver" && (
            <div className="mb-4 animate-fade-in" style={{ animation: "pulse-ring 2.5s ease-in-out" }}>
              <label className="form-label text-danger fw-semibold" style={{ fontSize: "0.85rem" }}>Ambulance Vehicle Number</label>
              <div className="input-group">
                <span className="input-group-text glass-input border-end-0 rounded-end-0 d-flex align-items-center justify-content-center" style={{ background: "rgba(20, 16, 28, 0.4)", width: "45px", borderColor: "rgba(239, 68, 68, 0.3)" }}>
                  <FaAmbulance size={14} className="text-danger" />
                </span>
                <input
                  type="text"
                  name="ambulanceNumber"
                  placeholder="e.g. DL 1CA 1234"
                  value={form.ambulanceNumber}
                  onChange={handleChange}
                  className="form-control glass-input border-start-0 rounded-start-0"
                  style={{ borderColor: "rgba(239, 68, 68, 0.3)" }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`btn-premium w-100 d-flex align-items-center justify-content-center gap-2 py-3 mt-2 ${role === "driver" ? "btn-premium-danger" : ""}`}
          >
            <FaUserPlus />
            {loading ? "Creating Account..." : "Register User"}
          </button>

          {/* Switch to Login */}
          <p className="text-center text-white-50 mt-4 mb-0" style={{ fontSize: "0.9rem" }}>
            Already have an account?
            <Link to="/login" className="ms-2 fw-bold text-decoration-none" style={{ color: "#a855f7" }}>
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;