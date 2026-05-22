import React, { useState } from "react";
import "../styles/login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // API login later
  };

  return (
    <div className="login-page">

      <div className="login-left">
        <h1>Retail Shop</h1>
        <p>
          Manage products, orders, customers and shopping experience
          with a modern retail platform.
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
          alt="Retail"
        />
      </div>

      <div className="login-right">

        <form className="login-form" onSubmit={handleSubmit}>

          <h2>Welcome Back</h2>

          <p className="subtitle">
            Login to continue shopping
          </p>

          <label>Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required
          />

          <div className="login-options">

            <label className="remember">
              <input type="checkbox" />
              Remember Me
            </label>

            <span className="forgot">
              Forgot Password?
            </span>

          </div>

          <button type="submit">
            Login
          </button>

          <p className="register-text">
            Don’t have an account?
            <span> Register</span>
          </p>

        </form>

      </div>

    </div>
  );
}