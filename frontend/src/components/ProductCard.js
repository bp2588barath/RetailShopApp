import React, { useState } from "react";
import "../styles/productcard.css";

export default function ProductCard({ product, onAddToCart }) {
  const [added, setAdded]       = useState(false);
  const [wishlisted, setWish]   = useState(false);
  const [imgError, setImgError] = useState(false);

  const discountPct = 20;
  const oldPrice    = Math.round(product.price / (1 - discountPct / 100));

  function handleAdd() {
    if (added) return;
    setAdded(true);
    if (onAddToCart) onAddToCart(product);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="pc-card">

      {/* ── IMAGE ── */}
      <div className="pc-img-wrap">
        {imgError ? (
          <div className="pc-img-fallback">📦</div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="pc-img"
            onError={() => setImgError(true)}
          />
        )}

        {/* Badges */}
        <span className="pc-badge-discount">{discountPct}% OFF</span>

        {product.stock === 0 && (
          <div className="pc-out-of-stock">Out of Stock</div>
        )}

        {/* Wishlist */}
        <button
          className={`pc-wish ${wishlisted ? "pc-wish--on" : ""}`}
          onClick={() => setWish(w => !w)}
          aria-label="Toggle wishlist"
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>

        {/* Quick view overlay */}
        <div className="pc-overlay">
          <span className="pc-quick">Quick View</span>
        </div>
      </div>

      {/* ── INFO ── */}
      <div className="pc-info">

        {/* Category */}
        {product.category && (
          <span className="pc-category">{product.category}</span>
        )}

        <h3 className="pc-name">{product.name}</h3>

        {/* Rating */}
        <div className="pc-rating">
          <span className="pc-stars">
            {"★".repeat(Math.floor(product.rating || 5))}
            {"☆".repeat(5 - Math.floor(product.rating || 5))}
          </span>
          <span className="pc-reviews">
            {product.rating || "5.0"} ({product.reviews || 120} reviews)
          </span>
        </div>

        <p className="pc-desc">
          {product.description || "Premium quality product with modern features and best performance."}
        </p>

        {/* Price */}
        <div className="pc-price-row">
          <span className="pc-price">₹{product.price.toLocaleString("en-IN")}</span>
          <span className="pc-old-price">₹{oldPrice.toLocaleString("en-IN")}</span>
          <span className="pc-savings">Save ₹{(oldPrice - product.price).toLocaleString("en-IN")}</span>
        </div>

        {/* Add to cart */}
        <button
          className={`pc-btn ${added ? "pc-btn--added" : ""} ${product.stock === 0 ? "pc-btn--disabled" : ""}`}
          onClick={handleAdd}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Out of Stock" : added ? "✓ Added to Cart!" : "+ Add to Cart"}
        </button>

      </div>
    </div>
  );
}