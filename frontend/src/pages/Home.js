import React from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import "../styles/home.css";

export default function Home() {

  const products = [

    {
      id: 1,
      name: "Wireless Headphones",
      price: 2999,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    },

    {
      id: 2,
      name: "Smart Watch",
      price: 4999,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },

    {
      id: 3,
      name: "Gaming Laptop",
      price: 55999,
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
    },

    {
      id: 4,
      name: "Gaming Mouse",
      price: 1499,
      image:
        "https://images.unsplash.com/photo-1527814050087-3793815479db"
    },

    {
      id: 5,
      name: "Bluetooth Speaker",
      price: 2499,
      image:
        "https://images.unsplash.com/photo-1585386959984-a4155224a1ad"
    },

    {
      id: 6,
      name: "DSLR Camera",
      price: 45999,
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
    }

  ];

  return (

    <div>

      <Navbar />

      {/* HERO SECTION */}

      <section className="hero">

        <div className="hero-left">

          <h1>
            Smart Shopping <br />
            Starts Here
          </h1>

          <p>
            Discover premium gadgets, fashion,
            accessories and amazing deals
            with our modern ecommerce platform.
          </p>

          <button>
            Shop Now
          </button>

        </div>

        <div className="hero-right">

          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da"
            alt="Shopping"
          />

        </div>

      </section>

      {/* CATEGORY SECTION */}

      <section className="categories">

        <div className="category-card">
          Electronics
        </div>

        <div className="category-card">
          Fashion
        </div>

        <div className="category-card">
          Grocery
        </div>

        <div className="category-card">
          Accessories
        </div>

      </section>

      {/* PRODUCT SECTION */}

      <section className="products-section">

        <h2>
          Featured Products
        </h2>

        <div className="products-grid">

          {products.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
            />

          ))}

        </div>

      </section>

      {/* OFFER SECTION */}

      <section className="offer-section">

        <div className="offer-content">

          <h1>
            Big Summer Sale
          </h1>

          <p>
            Up to 50% OFF on premium products
          </p>

          <button>
            Explore Deals
          </button>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="footer">

        <div>

          <h2>RetailShop</h2>

          <p>
            Your trusted ecommerce platform.
          </p>

        </div>

        <div>

          <h3>Quick Links</h3>

          <p>Home</p>
          <p>Products</p>
          <p>Orders</p>
          <p>Contact</p>

        </div>

        <div>

          <h3>Contact</h3>

          <p>support@retailshop.com</p>

          <p>+91 9876543210</p>

        </div>

      </footer>

    </div>

  );
}