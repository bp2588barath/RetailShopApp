import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Orders</h2>

        {orders.map((order) => (
          <div key={order._id} className="bg-white p-4 mb-4 rounded shadow">
            <p className="font-semibold">Total: ₹{order.totalAmount}</p>
            <p>Status: {order.orderStatus}</p>

            <h4 className="mt-2 font-bold">Items:</h4>
            {order.items.map((item) => (
              <p key={item._id}>
                {item.name} - {item.quantity} x ₹{item.price}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;