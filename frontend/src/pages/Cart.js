import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
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

  const updateQty = async (productId, qty) => {
    try {
      await API.put("/cart/update", {
        customerId,
        productId,
        quantity: qty,
      });
      fetchCart();
    } catch (err) {
      alert("Error updating cart");
    }
  };

  const removeItem = async (productId) => {
    try {
      await API.delete(`/cart/remove/${customerId}/${productId}`);
      fetchCart();
    } catch (err) {
      alert("Error removing item");
    }
  };

  const totalPrice =
    cart?.items?.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    ) || 0;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">My Cart</h2>

        {!cart || !cart.items || cart.items.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="bg-white p-5 rounded-xl shadow">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b py-3"
              >
                <div>
                  <p className="font-semibold">{item.productId.name}</p>
                  <p className="text-gray-600 text-sm">
                    ₹{item.productId.price} × {item.quantity}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() =>
                      updateQty(item.productId._id, item.quantity - 1)
                    }
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    -
                  </button>

                  <span className="font-bold">{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQty(item.productId._id, item.quantity + 1)
                    }
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item.productId._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Total: ₹{totalPrice}</h3>

              <button
                onClick={() => navigate("/checkout")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
