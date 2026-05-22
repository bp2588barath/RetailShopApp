import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/cart.css";

export default function Cart() {

  const [cartItems, setCartItems] = useState([

    {
      id:1,
      name:"Wireless Headphones",
      price:2999,
      quantity:1,
      image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    },

    {
      id:2,
      name:"Smart Watch",
      price:4999,
      quantity:1,
      image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    }

  ]);

  const increaseQty = (id) => {

    setCartItems(

      cartItems.map((item) =>

        item.id === id
          ? { ...item, quantity:item.quantity + 1 }
          : item

      )

    );

  };

  const decreaseQty = (id) => {

    setCartItems(

      cartItems.map((item) =>

        item.id === id && item.quantity > 1
          ? { ...item, quantity:item.quantity - 1 }
          : item

      )

    );

  };

  const totalPrice = cartItems.reduce(

    (total,item) => total + item.price * item.quantity,
    0

  );

  return (

    <div>

      <Navbar />

      <div className="cart-page">

        {/* LEFT */}

        <div className="cart-left">

          <h1>
            Shopping Cart
          </h1>

          {cartItems.map((item) => (

            <div className="cart-card" key={item.id}>

              <img
                src={item.image}
                alt={item.name}
              />

              <div className="cart-details">

                <h2>{item.name}</h2>

                <p>
                  Premium quality product with fast delivery.
                </p>

                <h3>
                  ₹ {item.price}
                </h3>

                <div className="quantity-controls">

                  <button
                    onClick={() => decreaseQty(item.id)}
                  >
                    -
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQty(item.id)}
                  >
                    +
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* RIGHT */}

        <div className="cart-right">

          <h2>Order Summary</h2>

          <div className="summary-row">

            <span>Items</span>

            <span>{cartItems.length}</span>

          </div>

          <div className="summary-row">

            <span>Delivery</span>

            <span>₹ 99</span>

          </div>

          <div className="summary-row total">

            <span>Total</span>

            <span>
              ₹ {totalPrice + 99}
            </span>

          </div>

          <button className="checkout-btn">
            Proceed To Checkout
          </button>

        </div>

      </div>

    </div>

  );
}