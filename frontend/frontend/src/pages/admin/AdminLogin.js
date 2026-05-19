import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const loginOwner = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/owner/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "owner");

      alert("Owner Login Success");
      navigate("/admin/dashboard");
    } catch (err) {
      alert("Owner Login Failed");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <form
        onSubmit={loginOwner}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4">Owner Login</h2>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Owner Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          type="password"
          placeholder="Owner Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;