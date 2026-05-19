import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  const addToCart = async (id) => {
    const userId = localStorage.getItem("userId");

    await API.post("/cart/add", {
      customerId: userId,
      productId: id,
      quantity: 1,
    });
  };

  return (
    <div>
      <Navbar />

      {/* HERO SECTION */}
      <div style={styles.hero}>
        <h1>Big Deals on Everything 🛍️</h1>
      </div>

      {/* PRODUCTS */}
      <div style={styles.grid}>
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  hero: {
    background: "#37475a",
    color: "white",
    padding: "40px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    padding: "20px",
  },
};