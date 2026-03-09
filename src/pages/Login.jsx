import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post("/auth/login", form);

      alert("Login Successful");

      console.log(res.data);

      // token save
      localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user._id);
      // 👇 Login ke baad booking page open hoga
      navigate("/book");

    } catch (error) {

      console.log(error);
      alert("Login Failed");

    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="w-full border p-2 mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2 mb-4"
        />

        <button
          type="submit"
          className="bg-green-500 text-white w-full py-2 rounded"
        >
          Login
        </button>

        <p className="text-center mt-4">
          Don't have an account?
          <Link to="/register" className="text-blue-500 ml-2">
            Register
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Login;