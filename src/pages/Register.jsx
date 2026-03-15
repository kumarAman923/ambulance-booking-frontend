import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Register() {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: ""
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
      toast.error("All fields are required");
      return;
    }

    if (form.phone.length < 10) {
      toast.error("Enter valid phone number");
      return;
    }

    setLoading(true);

    try {

      const res = await API.post("/auth/register", form);

      toast.success("Registration Successful 🚑");

      console.log(res.data);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      console.log(error);
      toast.error(error.response?.data?.message || "Registration Failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="container d-flex justify-content-center align-items-center vh-100">

      <div className="card shadow p-4" style={{ width: "420px" }}>

        {/* Header */}
        <div className="text-center mb-4">

          <h2 className="fw-bold">
            Create Account
          </h2>

          <p className="text-muted">
            Register for ambulance service
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="form-control mb-3"
          />

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="form-control mb-3"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="form-control mb-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-danger w-100"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        {/* Login link */}
        <p className="text-center mt-3">
          Already have an account?
          <Link
            to="/login"
            className="ms-2 text-decoration-none fw-semibold"
          >
            Login
          </Link>
        </p>

      </div>

    </div>

  );

}

export default Register;