import React from "react";

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition">
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-500 text-sm">{product.description}</p>

      <div className="mt-3 flex justify-between items-center">
        <p className="font-bold text-green-600">₹{product.price}</p>
        <p className="text-sm text-gray-600">Stock: {product.stock}</p>
      </div>

      <button
        onClick={() => onAddToCart(product._id)}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;