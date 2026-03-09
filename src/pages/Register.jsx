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
        navigate("/");
      }, 1500);

    } catch (error) {

      console.log(error);
      toast.error(error.response?.data?.message || "Registration Failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-red-600">

      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            Create Account
          </h2>

          <p className="text-sm text-gray-500">
            Register for ambulance service
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >

            {loading ? "Registering..." : "Register"}

          </button>

        </form>

        {/* Login link */}
        <p className="text-2xl font-bold text-white bg-red-500">

          Already have an account?{" "}

          <Link
            to="/Login"
            className="text-red-600 font-semibold hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Register;