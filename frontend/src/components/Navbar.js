import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiShoppingCart, FiSearch, FiUser, FiPackage, FiLogOut, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [query,       setQuery]   = useState("");
  const [menuOpen,    setMenu]    = useState(false);
  const [dropOpen,    setDrop]    = useState(false);
  const [scrolled,    setScrolled] = useState(false);
  const dropRef = useRef(null);

  /* read auth from storage */
  const user     = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");
  const isLoggedIn = !!user;
  const cartCount  = parseInt(localStorage.getItem("cartCount") || "0");

  /* shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDrop(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) { navigate(`/?search=${encodeURIComponent(query.trim())}`); setMenu(false); }
  }

  function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    setDrop(false);
    navigate("/login");
  }

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/",       label: "Home" },
    { to: "/orders", label: "Orders" },
  ];

  return (
    <>
      <style>{`
        .nb-link       { font-size:14px; font-weight:500; color:rgba(255,255,255,0.82); text-decoration:none; padding:6px 2px; border-bottom:2px solid transparent; transition:color 0.2s, border-color 0.2s; white-space:nowrap; }
        .nb-link:hover,
        .nb-link.active { color:#fff; border-bottom-color:#f59e0b; }
        .nb-icon-btn   { background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.82); display:flex; align-items:center; padding:6px; border-radius:8px; transition:color 0.2s, background 0.2s; }
        .nb-icon-btn:hover { color:#fff; background:rgba(255,255,255,0.1); }
        .nb-search-inp { width:100%; border:none; outline:none; font-size:14px; background:transparent; color:#111; font-family:inherit; }
        .nb-search-inp::placeholder { color:#9ca3af; }
        .nb-drop-item  { display:flex; align-items:center; gap:10px; padding:10px 14px; font-size:14px; color:#374151; cursor:pointer; border-radius:8px; transition:background 0.15s; background:none; border:none; width:100%; font-family:inherit; text-align:left; }
        .nb-drop-item:hover { background:#f3f4f6; }
        .nb-drop-item.red   { color:#ef4444; }
        .nb-drop-item.red:hover { background:#fef2f2; }
        .nb-mob-link   { display:flex; align-items:center; gap:10px; padding:12px 16px; font-size:15px; font-weight:500; color:#fff; text-decoration:none; border-radius:10px; transition:background 0.2s; }
        .nb-mob-link:hover, .nb-mob-link.active { background:rgba(255,255,255,0.1); }
        @keyframes dropIn  { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(100%)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 500,
        background: "#131921",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.35)" : "none",
        transition: "box-shadow 0.3s",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          padding: "0 1.25rem", height: 60, maxWidth: 1200, margin: "0 auto",
        }}>

          {/* ── LOGO ── */}
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
              🛍️ <span style={{ color: "#f59e0b" }}>Retail</span>Shop
            </span>
          </Link>

          {/* ── SEARCH BAR (desktop) ── */}
          <form onSubmit={handleSearch} style={{
            flex: 1, display: "flex", alignItems: "center",
            background: "#fff", borderRadius: 8, overflow: "hidden",
            maxWidth: 500, border: "2px solid transparent",
            transition: "border-color 0.2s",
          }}
            onFocus={e => e.currentTarget.style.borderColor = "#f59e0b"}
            onBlur={e  => e.currentTarget.style.borderColor = "transparent"}
          >
            <input
              className="nb-search-inp"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products, brands and more…"
              style={{ flex: 1, padding: "9px 14px" }}
            />
            <button type="submit" style={{
              background: "#f59e0b", border: "none", padding: "0 14px",
              height: "100%", cursor: "pointer", display: "flex", alignItems: "center",
              color: "#111",
            }}>
              <FiSearch size={18} strokeWidth={2.5} />
            </button>
          </form>

          {/* ── NAV LINKS (desktop) ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className={`nb-link${isActive(l.to) ? " active" : ""}`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* ── RIGHT ACTIONS ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>

            {/* Cart */}
            <Link to="/cart" style={{ position: "relative", display: "flex" }}>
              <button className="nb-icon-btn" aria-label="Cart">
                <FiShoppingCart size={22} />
                {cartCount > 0 && (
                  <span style={{
                    position: "absolute", top: 2, right: 2,
                    background: "#ef4444", color: "#fff",
                    fontSize: 10, fontWeight: 800,
                    width: 17, height: 17, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1.5px solid #131921",
                  }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </Link>

            {/* User dropdown / Login */}
            {isLoggedIn ? (
              <div ref={dropRef} style={{ position: "relative" }}>
                <button
                  className="nb-icon-btn"
                  onClick={() => setDrop(d => !d)}
                  aria-label="Account menu"
                  style={{ display: "flex", alignItems: "center", gap: 7 }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "#f59e0b", color: "#111",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 13,
                  }}>
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.name?.split(" ")[0]}
                  </span>
                </button>

                {dropOpen && (
                  <div style={{
                    position: "absolute", right: 0, top: "calc(100% + 10px)",
                    background: "#fff", borderRadius: 12, padding: 8,
                    minWidth: 200, boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                    border: "1px solid #e5e7eb", animation: "dropIn 0.2s ease",
                    zIndex: 600,
                  }}>
                    <div style={{ padding: "8px 14px 10px", borderBottom: "1px solid #f3f4f6", marginBottom: 4 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111" }}>{user.name}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>{user.email}</p>
                    </div>
                    <Link to="/orders" onClick={() => setDrop(false)} style={{ textDecoration: "none" }}>
                      <button className="nb-drop-item"><FiPackage size={15} /> My Orders</button>
                    </Link>
                    <Link to="/cart" onClick={() => setDrop(false)} style={{ textDecoration: "none" }}>
                      <button className="nb-drop-item"><FiShoppingCart size={15} /> My Cart</button>
                    </Link>
                    <div style={{ height: 1, background: "#f3f4f6", margin: "4px 0" }} />
                    <button className="nb-drop-item red" onClick={handleLogout}>
                      <FiLogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" style={{ textDecoration: "none" }}>
                <button style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", background: "#f59e0b", color: "#111",
                  border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700,
                  cursor: "pointer", transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  <FiUser size={15} /> Sign In
                </button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="nb-icon-btn"
              onClick={() => setMenu(m => !m)}
              aria-label="Toggle menu"
              style={{ display: "none" }}
              id="nb-hamburger"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* ── MOBILE SEARCH ── */}
        <form onSubmit={handleSearch} style={{
          display: "none", padding: "0 1rem 10px",
        }} id="nb-mob-search">
          <div style={{
            display: "flex", alignItems: "center",
            background: "#fff", borderRadius: 8, overflow: "hidden",
          }}>
            <input
              className="nb-search-inp"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products…"
              style={{ flex: 1, padding: "9px 14px" }}
            />
            <button type="submit" style={{ background: "#f59e0b", border: "none", padding: "9px 14px", cursor: "pointer" }}>
              <FiSearch size={16} />
            </button>
          </div>
        </form>
      </nav>

      {/* ══ MOBILE SIDE DRAWER ══ */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 800,
          display: "flex",
        }}>
          {/* backdrop */}
          <div style={{ flex: 1, background: "rgba(0,0,0,0.5)" }} onClick={() => setMenu(false)} />

          {/* drawer */}
          <div style={{
            width: 260, background: "#131921", height: "100%",
            padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: 6,
            animation: "slideIn 0.25s ease",
            overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>🛍️ Menu</span>
              <button className="nb-icon-btn" onClick={() => setMenu(false)}><FiX size={20} /></button>
            </div>

            {isLoggedIn && (
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#fff" }}>{user.name}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{user.email}</p>
              </div>
            )}

            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className={`nb-mob-link${isActive(l.to) ? " active" : ""}`} onClick={() => setMenu(false)}>
                {l.label}
              </Link>
            ))}

            <Link to="/cart" className="nb-mob-link" onClick={() => setMenu(false)}>
              🛒 Cart {cartCount > 0 && <span style={{ background: "#ef4444", color: "#fff", fontSize: 11, padding: "1px 7px", borderRadius: 100, marginLeft: 4 }}>{cartCount}</span>}
            </Link>

            <div style={{ flex: 1 }} />

            {isLoggedIn ? (
              <button onClick={() => { handleLogout(); setMenu(false); }} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 16px", background: "rgba(239,68,68,0.15)",
                color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: "pointer", width: "100%", fontFamily: "inherit",
              }}>
                <FiLogOut size={16} /> Sign Out
              </button>
            ) : (
              <Link to="/login" style={{ textDecoration: "none" }} onClick={() => setMenu(false)}>
                <button style={{
                  width: "100%", padding: "12px", background: "#f59e0b",
                  color: "#111", border: "none", borderRadius: 10,
                  fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}>
                  Sign In →
                </button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* responsive CSS */}
      <style>{`
        @media (max-width: 680px) {
          #nb-hamburger  { display:flex !important; }
          #nb-mob-search { display:flex !important; }
          .nb-link       { display:none; }
        }
      `}</style>
    </>
  );
}