import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* MAIN PAGES */

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

/* ADMIN PAGES */

import Dashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* CUSTOMER ROUTES */}

        <Route path="/" element={<Home />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/orders" element={<Orders />} />

        {/* AUTH */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ADMIN */}

        <Route path="/admin" element={<Dashboard />} />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/products"
          element={<ManageProducts />}
        />

        <Route
          path="/admin/orders"
          element={<ManageOrders />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;