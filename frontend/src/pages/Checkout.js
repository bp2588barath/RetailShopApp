import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const customerId = localStorage.getItem("userId");

  const fetchCart = async () => {
    try {
      const res = await API.get(`/cart/${customerId}`);
      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (customerId) fetchCart();
  }, [customerId]);

  const totalPrice =
    cart?.items?.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    ) || 0;

  const placeOrder = async () => {
    if (!cart || cart.items.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const items = cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));

      await API.post("/orders/create", {
        customerId,
        paymentMethod: "COD",
        items,
      });

      alert("Order Placed Successfully!");
      navigate("/orders");
    } catch (err) {
      alert("Order Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

        {!cart || !cart.items ? (
          <p>Loading cart...</p>
        ) : cart.items.length === 0 ? (
          <p className="text-gray-600">Cart is empty.</p>
        ) : (
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>

            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between border-b py-2">
                <p>{item.productId.name}</p>
                <p>
                  {item.quantity} × ₹{item.productId.price}
                </p>
              </div>
            ))}

            <div className="mt-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Total: ₹{totalPrice}</h3>

              <button
                onClick={placeOrder}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? "Placing..." : "Place Order (COD)"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;