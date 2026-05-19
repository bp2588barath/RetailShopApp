import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/customer/register", form);
      alert("Registered Successfully");
      navigate("/login");
    } catch (err) {
      alert("Register failed");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="flex justify-center items-center p-10">
        <form
          onSubmit={handleRegister}
          className="bg-white p-6 rounded-xl shadow-md w-96"
        >
          <h2 className="text-xl font-bold mb-4">Customer Register</h2>

          <input className="w-full border p-2 mb-3" name="name" placeholder="Name" onChange={handleChange} />
          <input className="w-full border p-2 mb-3" name="email" placeholder="Email" onChange={handleChange} />
          <input className="w-full border p-2 mb-3" name="phone" placeholder="Phone" onChange={handleChange} />
          <input className="w-full border p-2 mb-3" name="address" placeholder="Address" onChange={handleChange} />
          <input className="w-full border p-2 mb-3" name="password" type="password" placeholder="Password" onChange={handleChange} />

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;