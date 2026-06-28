import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { FaPhoneAlt, FaLock, FaSignInAlt } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    phone: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.phone || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);

      toast.success("Login Successful 🚀");
      
      // Save info to local storage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("userRole", res.data.user.role);
      localStorage.setItem("userName", res.data.user.name);
      
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else if (res.data.user.role === "driver" && res.data.user.driverId) {
        localStorage.setItem("driverId", res.data.user.driverId);
        navigate("/driver");
      } else {
        navigate("/book");
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login Failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "85vh" }}>
      <div className="glass-card p-4 p-md-5" style={{ width: "100%", maxWidth: "420px" }}>
        
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="fw-extrabold text-white mb-2" style={{ fontSize: "2rem" }}>
            Welcome Back
          </h2>
          <p className="text-muted" style={{ fontSize: "0.9rem", fontFamily: "var(--font-secondary)" }}>
            Login to request emergency transport or manage tasks.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Phone Field */}
          <div className="mb-3">
            <label className="form-label text-white-50 fw-semibold" style={{ fontSize: "0.85rem" }}>Phone Number</label>
            <div className="input-group">
              <span className="input-group-text glass-input border-end-0 rounded-end-0 d-flex align-items-center justify-content-center" style={{ background: "rgba(20, 16, 28, 0.4)", width: "45px" }}>
                <FaPhoneAlt size={14} className="text-muted" />
              </span>
              <input
                type="text"
                name="phone"
                placeholder="Enter 10-digit number"
                value={form.phone}
                onChange={handleChange}
                className="form-control glass-input border-start-0 rounded-start-0"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="form-label text-white-50 fw-semibold" style={{ fontSize: "0.85rem" }}>Password</label>
            <div className="input-group">
              <span className="input-group-text glass-input border-end-0 rounded-end-0 d-flex align-items-center justify-content-center" style={{ background: "rgba(20, 16, 28, 0.4)", width: "45px" }}>
                <FaLock size={14} className="text-muted" />
              </span>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="form-control glass-input border-start-0 rounded-start-0"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-premium w-100 d-flex align-items-center justify-content-center gap-2 py-3"
          >
            <FaSignInAlt />
            {loading ? "Authenticating..." : "Login to Console"}
          </button>

          {/* Switch to Register */}
          <p className="text-center text-white-50 mt-4 mb-0" style={{ fontSize: "0.9rem" }}>
            Don't have an account?
            <Link to="/register" className="ms-2 fw-bold text-decoration-none" style={{ color: "#a855f7" }}>
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;