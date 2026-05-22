import React from "react";
import "../styles/productcard.css";

export default function ProductCard({ product }) {

  return (

    <div className="product-card">

      <div className="product-image-container">

        <img
          src={product.image}
          alt={product.name}
        />

        <span className="discount-badge">
          20% OFF
        </span>

      </div>

      <div className="product-info">

        <h3>{product.name}</h3>

        <div className="rating">

          ⭐⭐⭐⭐⭐
          <span>(120 Reviews)</span>

        </div>

        <p className="description">
          Premium quality product with modern features
          and best performance.
        </p>

        <div className="price-section">

          <h2>₹ {product.price}</h2>

          <span className="old-price">
            ₹ {product.price + 1000}
          </span>

        </div>

        <button>
          Add To Cart
        </button>

      </div>

    </div>

  );
}