import React, { useEffect, useCallback, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const customerId = localStorage.getItem("userId");

  const fetchCart = useCallback(async () => {
    try {
      const res = await API.get(`/cart/${customerId}`);
      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const placeOrder = async () => {
    try {
      const items = cart.items.map((i) => ({
        productId: i.productId._id,
        quantity: i.quantity,
      }));

      await API.post("/orders/create", {
        customerId,
        items,
        paymentMethod: "COD",
      });

      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.log(err);
    }
  };

  if (!cart) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />

      <div className="p-5">
        <h2 className="text-2xl font-bold">Checkout</h2>

        {cart.items.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <>
            {cart.items.map((item) => (
              <div key={item._id} className="border p-3 mt-3">
                <p>{item.productId.name}</p>
                <p>Qty: {item.quantity}</p>
              </div>
            ))}

            <button
              onClick={placeOrder}
              className="bg-green-600 text-white px-4 py-2 mt-4"
            >
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;