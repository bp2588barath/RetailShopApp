import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-bold">Retail Shop</h1>

      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:text-gray-200">Home</Link>
        <Link to="/cart" className="hover:text-gray-200">Cart</Link>
        <Link to="/orders" className="hover:text-gray-200">Orders</Link>
        <Link to="/admin" className="hover:text-gray-200">Owner</Link>

        {!token ? (
          <Link to="/login" className="hover:text-gray-200">Login</Link>
        ) : (
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;