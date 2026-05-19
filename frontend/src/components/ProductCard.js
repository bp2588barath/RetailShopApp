import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

export default function ProductCard({ product, addToCart }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      style={styles.card}
    >
      <img
        src={product.image || "https://via.placeholder.com/200"}
        style={styles.img}
      />

      <h3>{product.name}</h3>

      <div style={styles.rating}>
        <FiStar color="gold" />
        <FiStar color="gold" />
        <FiStar color="gold" />
        <FiStar color="gold" />
        <FiStar />
      </div>

      <p style={styles.price}>₹ {product.price}</p>

      <button
        style={styles.btn}
        onClick={() => addToCart(product._id)}
      >
        Add to Cart
      </button>
    </motion.div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  img: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  rating: {
    display: "flex",
    marginTop: "5px",
  },
  price: {
    fontWeight: "bold",
    marginTop: "5px",
  },
  btn: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#ff9900",
    border: "none",
    borderRadius: "5px",
  },
};