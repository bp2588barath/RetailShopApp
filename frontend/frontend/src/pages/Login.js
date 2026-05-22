import React, { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/customer/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "customer");

      alert("Login Success");
      navigate("/");
    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="flex justify-center items-center p-10">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-xl shadow-md w-96"
        >
          <h2 className="text-xl font-bold mb-4">Customer Login</h2>

          <input
            className="w-full border p-2 mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border p-2 mb-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>

          <p className="mt-3 text-sm">
            New user?{" "}
            <Link className="text-blue-600" to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;