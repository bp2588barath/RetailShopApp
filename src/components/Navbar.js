import { Link } from "react-router-dom";
import { FiShoppingCart, FiSearch } from "react-icons/fi";

export default function Navbar() {
  return (
    <div style={styles.nav}>
      
      {/* LEFT LOGO */}
      <div style={styles.logo}>
        RetailShop
      </div>

      {/* SEARCH BAR */}
      <div style={styles.searchBox}>
        <input placeholder="Search products..." style={styles.input} />
        <FiSearch />
      </div>

      {/* RIGHT LINKS */}
      <div style={styles.links}>
        <Link to="/login">Login</Link>
        <Link to="/cart">
          <FiShoppingCart size={22} />
        </Link>
      </div>

    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#131921",
    color: "white",
    padding: "10px 20px",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  searchBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    background: "white",
    margin: "0 20px",
    padding: "5px 10px",
    borderRadius: "5px",
    color: "black",
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
  },
  links: {
    display: "flex",
    gap: "15px",
  },
};