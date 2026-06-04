import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

const products = [
  { id: 1, name: "Wireless Headphones", price: 2999, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", category: "Electronics", rating: 4.5, reviews: 128 },
  { id: 2, name: "Smart Watch", price: 4999, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30", category: "Electronics", rating: 4.3, reviews: 95 },
  { id: 3, name: "Gaming Laptop", price: 55999, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853", category: "Electronics", rating: 4.7, reviews: 210 },
  { id: 4, name: "Gaming Mouse", price: 1499, image: "https://images.unsplash.com/photo-1527814050087-3793815479db", category: "Accessories", rating: 4.2, reviews: 74 },
  { id: 5, name: "Bluetooth Speaker", price: 2499, image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad", category: "Electronics", rating: 4.4, reviews: 156 },
  { id: 6, name: "DSLR Camera", price: 45999, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32", category: "Electronics", rating: 4.8, reviews: 302 },
];

const categories = [
  { name: "Electronics", icon: "⚡", color: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
  { name: "Fashion",     icon: "👗", color: "#fdf4ff", border: "#e9d5ff", text: "#7e22ce" },
  { name: "Grocery",     icon: "🛒", color: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
  { name: "Accessories", icon: "💎", color: "#fff7ed", border: "#fed7aa", text: "#c2410c" },
];

const banners = [
  { bg: "linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%)", tag: "Summer Sale", heading: "Up to 50% OFF\non Premium Gadgets", sub: "Limited time offer — don't miss out!", cta: "Shop Now →", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da" },
  { bg: "linear-gradient(135deg,#1a1a2e 0%,#7c3aed 100%)", tag: "New Arrivals", heading: "Latest Tech\nDeals of 2025", sub: "Explore the newest gadgets at best prices", cta: "Explore →", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853" },
  { bg: "linear-gradient(135deg,#064e3b 0%,#059669 100%)", tag: "Flash Deal", heading: "Weekend Special\nUp to 40% OFF", sub: "Grab it before it's gone!", cta: "Grab Deal →", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30" },
];

function StarRating({ rating }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: 13 }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
      <span style={{ color: "#6b7280", marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

function Toast({ msg }) {
  return msg ? (
    <div style={{
      position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
      background: "#111", color: "#fff", padding: "12px 24px", borderRadius: "100px",
      fontSize: 14, fontWeight: 500, zIndex: 9999,
      animation: "slideUp 0.3s ease", whiteSpace: "nowrap",
    }}>
      🛒 {msg}
    </div>
  ) : null;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [bannerIdx, setBannerIdx] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);

  /* Auto-rotate hero banner */
  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function toggleWishlist(id) {
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
    showToast(wishlist.includes(id) ? "Removed from wishlist" : "Added to wishlist ❤️");
  }

  function addToCart(name) {
    setCartCount(c => c + 1);
    showToast(`${name} added to cart!`);
  }

  /* Filter + sort */
  let filtered = products.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const banner = banners[bannerIdx];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      <style>{`
        @keyframes slideUp { from { transform: translateX(-50%) translateY(20px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .prod-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.10) !important; }
        .cat-chip:hover { transform: translateY(-2px); }
        .cta-btn:hover { opacity: 0.88; }
        .wish-btn:hover { transform: scale(1.2); }
        .add-btn:hover { background: #1d4ed8 !important; }
        .footer-link:hover { color: #2563eb !important; }
      `}</style>

      <Navbar cartCount={cartCount} />
      <Toast msg={toast} />

      {/* ══ HERO BANNER ══ */}
      <section style={{
        background: banner.bg, borderRadius: 20, margin: "1rem 1.5rem",
        display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 320,
        overflow: "hidden", transition: "background 0.8s ease", position: "relative",
      }}>
        {/* Dots */}
        <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 2 }}>
          {banners.map((_, i) => (
            <div key={i} onClick={() => setBannerIdx(i)} style={{
              width: i === bannerIdx ? 24 : 8, height: 8, borderRadius: 100,
              background: i === bannerIdx ? "#fff" : "rgba(255,255,255,0.4)",
              cursor: "pointer", transition: "all 0.3s",
            }} />
          ))}
        </div>

        <div style={{ padding: "3rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16, animation: "fadeIn 0.5s ease" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100, width: "fit-content", letterSpacing: "0.06em" }}>
            {banner.tag}
          </span>
          <h1 style={{ color: "#fff", margin: 0, fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 800, lineHeight: 1.2, whiteSpace: "pre-line" }}>
            {banner.heading}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: 14 }}>{banner.sub}</p>
          <button className="cta-btn" style={{
            width: "fit-content", padding: "12px 28px",
            background: "#fff", color: "#111", border: "none",
            borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s",
          }}>
            {banner.cta}
          </button>
        </div>
        <div style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={banner.img} alt="banner" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
        </div>
      </section>

      {/* ══ CATEGORIES ══ */}
      <section style={{ padding: "2rem 1.5rem 0" }}>
        <h2 style={{ margin: "0 0 1rem", fontSize: 18, fontWeight: 700, color: "#111" }}>Shop by Category</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["All", ...categories.map(c => c.name)].map(cat => {
            const info = categories.find(c => c.name === cat);
            const active = activeCategory === cat;
            return (
              <button key={cat} className="cat-chip" onClick={() => setActiveCategory(cat)} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 20px", borderRadius: 100, cursor: "pointer",
                border: `1.5px solid ${active ? (info?.border || "#2563eb") : "#e5e7eb"}`,
                background: active ? (info?.color || "#eff6ff") : "#fff",
                color: active ? (info?.text || "#1d4ed8") : "#374151",
                fontWeight: active ? 700 : 500, fontSize: 14,
                transition: "all 0.2s", boxShadow: active ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              }}>
                {info?.icon || "🏪"} {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* ══ SEARCH + SORT BAR ══ */}
      <section style={{ padding: "1.25rem 1.5rem", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#9ca3af" }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            style={{
              width: "100%", padding: "11px 14px 11px 40px", borderRadius: 10,
              border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none",
              background: "#fff", boxSizing: "border-box", fontFamily: "inherit",
            }}
          />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{
          padding: "11px 16px", borderRadius: 10, border: "1.5px solid #e5e7eb",
          fontSize: 14, background: "#fff", cursor: "pointer", fontFamily: "inherit",
        }}>
          <option value="default">Sort: Default</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
        <span style={{ fontSize: 13, color: "#6b7280" }}>{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
      </section>

      {/* ══ PRODUCTS GRID ══ */}
      <section style={{ padding: "0 1.5rem 2rem" }}>
        <h2 style={{ margin: "0 0 1rem", fontSize: 18, fontWeight: 700, color: "#111" }}>Featured Products</h2>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#9ca3af" }}>
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>🔍</p>
            <p style={{ fontSize: 16 }}>No products found for "{search}"</p>
            <button onClick={() => setSearch("")} style={{ marginTop: 12, padding: "8px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>Clear Search</button>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
              {filtered.slice(0, visibleCount).map(product => (
                <div key={product.id} className="prod-card" style={{
                  background: "#fff", borderRadius: 14, overflow: "hidden",
                  border: "1px solid #f3f4f6", transition: "all 0.25s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}>
                  {/* Image */}
                  <div style={{ position: "relative", overflow: "hidden", height: 200 }}>
                    <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                      onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                      onMouseLeave={e => e.target.style.transform = "scale(1)"}
                    />
                    <button className="wish-btn" onClick={() => toggleWishlist(product.id)} style={{
                      position: "absolute", top: 10, right: 10,
                      background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%",
                      width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", fontSize: 16, transition: "transform 0.2s",
                    }}>
                      {wishlist.includes(product.id) ? "❤️" : "🤍"}
                    </button>
                    <span style={{
                      position: "absolute", top: 10, left: 10,
                      background: "#dcfce7", color: "#15803d", fontSize: 11,
                      fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                    }}>
                      {product.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "14px 16px" }}>
                    <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, color: "#111" }}>{product.name}</h3>
                    <StarRating rating={product.rating} />
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>{product.reviews} reviews</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#111" }}>
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <button className="add-btn" onClick={() => addToCart(product.name)} style={{
                        padding: "8px 16px", background: "#2563eb", color: "#fff",
                        border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
                        cursor: "pointer", transition: "background 0.2s",
                      }}>
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <button onClick={() => setVisibleCount(v => v + 3)} style={{
                  padding: "12px 32px", border: "1.5px solid #2563eb", color: "#2563eb",
                  background: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}>
                  Load More Products
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ══ OFFER BANNER ══ */}
      <section style={{
        margin: "0 1.5rem 2rem", borderRadius: 16, overflow: "hidden",
        background: "linear-gradient(135deg,#7c3aed,#2563eb)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "2.5rem 3rem", gap: 24,
      }}>
        <div>
          <p style={{ margin: "0 0 6px", color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em" }}>LIMITED TIME OFFER</p>
          <h2 style={{ margin: "0 0 8px", color: "#fff", fontSize: "clamp(20px,3vw,30px)", fontWeight: 800 }}>Big Summer Sale 🔥</h2>
          <p style={{ margin: "0 0 20px", color: "rgba(255,255,255,0.8)", fontSize: 15 }}>Up to 50% OFF on premium products</p>
          <button style={{
            padding: "12px 28px", background: "#fff", color: "#7c3aed",
            border: "none", borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: "pointer",
            animation: "pulse 2s infinite",
          }}>
            Explore Deals →
          </button>
        </div>
        <div style={{ fontSize: "clamp(48px,8vw,80px)", userSelect: "none" }}>🛍️</div>
      </section>

      {/* ══ STATS BAR ══ */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "#e5e7eb", margin: "0 1.5rem 2rem", borderRadius: 14, overflow: "hidden" }}>
        {[
          { icon: "🚚", label: "Free Delivery", sub: "Orders above ₹499" },
          { icon: "🔄", label: "Easy Returns", sub: "30-day return policy" },
          { icon: "🔒", label: "Secure Payment", sub: "100% safe checkout" },
          { icon: "🎧", label: "24/7 Support", sub: "Always here for you" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", padding: "1.25rem", textAlign: "center" }}>
            <p style={{ fontSize: 26, margin: "0 0 6px" }}>{s.icon}</p>
            <p style={{ margin: "0 0 3px", fontWeight: 700, fontSize: 13, color: "#111" }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{s.sub}</p>
          </div>
        ))}
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: "#111", color: "#fff", padding: "3rem 2rem 1.5rem", marginTop: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "2rem", maxWidth: 900, margin: "0 auto 2rem" }}>
          <div>
            <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>🛍️ RetailShop</h2>
            <p style={{ margin: "0 0 16px", color: "#9ca3af", fontSize: 13, lineHeight: 1.6 }}>Your trusted ecommerce platform for premium products at the best prices.</p>
            <div style={{ display: "flex", gap: 10 }}>
              {["📘","🐦","📸","▶️"].map((icon, i) => (
                <div key={i} style={{ width: 34, height: 34, background: "#222", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>{icon}</div>
              ))}
            </div>
          </div>
          {[
            { title: "Quick Links", links: ["Home","Products","Orders","Contact"] },
            { title: "Categories", links: ["Electronics","Fashion","Grocery","Accessories"] },
            { title: "Support", links: ["FAQ","Returns","Shipping","Privacy Policy"] },
          ].map(col => (
            <div key={col.title}>
              <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.06em" }}>{col.title.toUpperCase()}</h3>
              {col.links.map(l => (
                <p key={l} className="footer-link" style={{ margin: "0 0 8px", fontSize: 13, color: "#9ca3af", cursor: "pointer", transition: "color 0.2s" }}>{l}</p>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #222", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, maxWidth: 900, margin: "0 auto" }}>
          <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>© 2025 RetailShop. All rights reserved.</p>
          <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>support@retailshop.com · +91 9876543210</p>
        </div>
      </footer>
    </div>
  );
}