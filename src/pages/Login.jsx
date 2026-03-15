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

      // login ke baad booking page
      navigate("/book");

    } catch (error) {

      console.log(error);
      alert("Login Failed");

    }
  };

  return (

    <div className="container d-flex justify-content-center align-items-center vh-100">

      <div className="card shadow p-4" style={{ width: "400px" }}>

        <h2 className="text-center mb-4 fw-bold">
          Login
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            className="form-control mb-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="form-control mb-3"
          />

          <button
            type="submit"
            className="btn btn-success w-100"
          >
            Login
          </button>

          <p className="text-center mt-3">
            Don't have an account?
            <Link to="/register" className="ms-2">
              Register
            </Link>
          </p>

        </form>

      </div>

    </div>

  );
}

export default Login;