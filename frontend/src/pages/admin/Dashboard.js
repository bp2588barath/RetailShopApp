import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">Owner Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/manage-products"
          className="bg-white shadow p-6 rounded-xl hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold">Manage Products</h3>
          <p className="text-gray-500 mt-2">
            Add, Update, Delete products and manage stock.
          </p>
        </Link>

        <Link
          to="/admin/manage-orders"
          className="bg-white shadow p-6 rounded-xl hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold">Manage Orders</h3>
          <p className="text-gray-500 mt-2">
            View all customer orders and track order status.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;