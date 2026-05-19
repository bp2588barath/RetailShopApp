import React, { useEffect, useCallback, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Cart() {
  const [cart, setCart] = useState(null);

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

  const updateQuantity = async (productId, type) => {
    try {
      await API.put("/cart/update", {
        customerId,
        productId,
        type,
      });
      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await API.delete(`/cart/remove/${customerId}/${productId}`);
      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="p-5">
        <h2 className="text-2xl font-bold">My Cart</h2>

        {!cart || cart.items?.length === 0 ? (
          <p className="mt-4">Cart is empty</p>
        ) : (
          cart.items.map((item) => (
            <div key={item._id} className="border p-3 mt-3">
              <h3>{item.productId.name}</h3>

              <p>Price: ₹{item.productId.price}</p>

              <p>Qty: {item.quantity}</p>

              <button onClick={() => updateQuantity(item.productId._id, "inc")}>
                +
              </button>

              <button onClick={() => updateQuantity(item.productId._id, "dec")}>
                -
              </button>

              <button onClick={() => removeItem(item.productId._id)}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Cart;