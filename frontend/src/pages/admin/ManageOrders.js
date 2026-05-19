import React, { useEffect, useState } from "react";
import API from "../../services/api";

function ManageOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await API.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/update-status/${orderId}`, {
        orderStatus: status,
      });

      alert("Order status updated");
      fetchOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>

      <div className="bg-white p-5 rounded-xl shadow">
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border p-4 rounded-lg">
                <p className="font-bold text-lg">Total: ₹{order.totalAmount}</p>

                <p className="text-sm text-gray-600">
                  Payment: {order.paymentMethod} | {order.paymentStatus}
                </p>

                <p className="text-sm font-semibold text-blue-600">
                  Status: {order.orderStatus}
                </p>

                <h4 className="mt-2 font-semibold">Items:</h4>
                <ul className="list-disc ml-6 text-gray-700">
                  {order.items.map((item) => (
                    <li key={item._id}>
                      {item.name} - {item.quantity} × ₹{item.price}
                    </li>
                  ))}
                </ul>

                {/* Status Buttons */}
                <div className="mt-4 flex gap-2 flex-wrap">
                  <button
                    onClick={() => updateStatus(order._id, "Pending")}
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    Pending
                  </button>

                  <button
                    onClick={() => updateStatus(order._id, "Packed")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Packed
                  </button>

                  <button
                    onClick={() => updateStatus(order._id, "Delivered")}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Delivered
                  </button>

                  <button
                    onClick={() => updateStatus(order._id, "Cancelled")}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Cancelled
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Order ID: {order._id}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageOrders;