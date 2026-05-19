import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const addToCart = async (productId) => {
    try {
      const customerId = localStorage.getItem("userId");
      if (!customerId) {
        alert("Please login first");
        return;
      }

      await API.post("/cart/add", {
        customerId,
        productId,
        quantity: 1,
      });

      alert("Added to cart");
    } catch (err) {
      alert("Error adding to cart");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Available Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onAddToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;