import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f0f13;
    --surface: #17171e;
    --surface2: #1e1e28;
    --border: #2a2a38;
    --accent: #f97316;
    --accent2: #fb923c;
    --green: #22c55e;
    --red: #ef4444;
    --blue: #3b82f6;
    --text: #f1f1f3;
    --muted: #7c7c8a;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  .dash-root { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: 240px; min-height: 100vh; background: var(--surface);
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    padding: 28px 0; position: fixed; top: 0; left: 0; z-index: 100;
  }
  .sidebar-logo {
    font-family: var(--font-head); font-size: 20px; font-weight: 800;
    color: var(--accent); padding: 0 24px 32px; letter-spacing: -0.5px;
    display: flex; align-items: center; gap: 10px;
  }
  .sidebar-logo span { font-size: 24px; }
  .nav-label {
    font-size: 10px; font-weight: 600; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1.5px;
    padding: 0 24px 10px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 24px; cursor: pointer; font-size: 14px; font-weight: 500;
    color: var(--muted); border-left: 3px solid transparent;
    transition: all 0.15s ease;
  }
  .nav-item:hover { color: var(--text); background: var(--surface2); }
  .nav-item.active { color: var(--accent); border-left-color: var(--accent); background: rgba(249,115,22,0.07); }
  .nav-item .icon { font-size: 16px; width: 20px; text-align: center; }
  .sidebar-bottom { margin-top: auto; padding: 0 16px; }
  .logout-btn {
    width: 100%; padding: 11px 16px; border-radius: 10px;
    background: rgba(239,68,68,0.1); color: var(--red); border: 1px solid rgba(239,68,68,0.2);
    cursor: pointer; font-family: var(--font-body); font-size: 14px; font-weight: 500;
    display: flex; align-items: center; gap: 10px; transition: all 0.15s;
  }
  .logout-btn:hover { background: rgba(239,68,68,0.2); }

  /* MAIN */
  .main { margin-left: 240px; flex: 1; padding: 32px; background: var(--bg); }

  /* TOPBAR */
  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 32px;
  }
  .topbar-left h1 {
    font-family: var(--font-head); font-size: 26px; font-weight: 800;
    letter-spacing: -0.5px;
  }
  .topbar-left p { font-size: 13px; color: var(--muted); margin-top: 3px; }
  .search-box {
    display: flex; align-items: center; gap: 10px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 16px; width: 260px;
  }
  .search-box input {
    background: none; border: none; outline: none; color: var(--text);
    font-family: var(--font-body); font-size: 14px; width: 100%;
  }
  .search-box input::placeholder { color: var(--muted); }

  /* STATS */
  .stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px;
  }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 22px; position: relative; overflow: hidden;
    transition: transform 0.2s, border-color 0.2s;
  }
  .stat-card:hover { transform: translateY(-2px); border-color: var(--accent); }
  .stat-card .stat-icon {
    font-size: 28px; margin-bottom: 12px; display: block;
  }
  .stat-card .stat-value {
    font-family: var(--font-head); font-size: 28px; font-weight: 800;
    color: var(--text);
  }
  .stat-card .stat-label { font-size: 13px; color: var(--muted); margin-top: 4px; }
  .stat-card .stat-glow {
    position: absolute; top: -30px; right: -30px;
    width: 80px; height: 80px; border-radius: 50%;
    opacity: 0.15;
  }

  /* SECTION CARD */
  .section-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px; margin-bottom: 28px;
  }
  .section-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;
  }
  .section-title {
    font-family: var(--font-head); font-size: 17px; font-weight: 700;
  }
  .badge {
    background: rgba(249,115,22,0.12); color: var(--accent);
    border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600;
  }

  /* FORM */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr 2fr auto; gap: 12px; align-items: end; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-group label { font-size: 12px; color: var(--muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
  .form-input {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; padding: 11px 14px; color: var(--text);
    font-family: var(--font-body); font-size: 14px; outline: none;
    transition: border-color 0.15s;
  }
  .form-input:focus { border-color: var(--accent); }
  .form-input::placeholder { color: var(--muted); }

  /* BUTTONS */
  .btn {
    padding: 11px 22px; border-radius: 10px; border: none; cursor: pointer;
    font-family: var(--font-body); font-size: 14px; font-weight: 600;
    display: inline-flex; align-items: center; gap: 8px;
    transition: all 0.15s ease; white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: var(--accent2); transform: translateY(-1px); }
  .btn-ghost { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger { background: rgba(239,68,68,0.1); color: var(--red); border: 1px solid rgba(239,68,68,0.15); }
  .btn-danger:hover { background: rgba(239,68,68,0.2); }
  .btn-edit { background: rgba(59,130,246,0.1); color: var(--blue); border: 1px solid rgba(59,130,246,0.15); }
  .btn-edit:hover { background: rgba(59,130,246,0.2); }
  .btn-sm { padding: 7px 14px; font-size: 13px; }
  .btn-cancel { background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }

  /* PRODUCT TABLE */
  .product-table { width: 100%; border-collapse: collapse; }
  .product-table th {
    text-align: left; font-size: 11px; font-weight: 600; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1px; padding: 0 16px 14px;
    border-bottom: 1px solid var(--border);
  }
  .product-table td {
    padding: 14px 16px; border-bottom: 1px solid rgba(42,42,56,0.5);
    font-size: 14px; vertical-align: middle;
  }
  .product-table tr:last-child td { border-bottom: none; }
  .product-table tr:hover td { background: rgba(249,115,22,0.03); }
  .product-img {
    width: 44px; height: 44px; border-radius: 10px; object-fit: cover;
    border: 1px solid var(--border);
  }
  .product-img-placeholder {
    width: 44px; height: 44px; border-radius: 10px;
    background: var(--surface2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .product-name { font-weight: 600; color: var(--text); }
  .product-price { font-family: var(--font-head); font-weight: 700; color: var(--accent); }
  .actions { display: flex; gap: 8px; }

  /* TOAST */
  .toast-container { position: fixed; top: 24px; right: 24px; z-index: 999; display: flex; flex-direction: column; gap: 10px; }
  .toast {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 12px; padding: 14px 20px; font-size: 14px; font-weight: 500;
    display: flex; align-items: center; gap: 10px; min-width: 260px;
    animation: slideIn 0.3s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .toast.success { border-left: 3px solid var(--green); }
  .toast.error { border-left: 3px solid var(--red); }
  @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    z-index: 200; display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 32px; width: 480px; max-width: 90vw;
    animation: popIn 0.25s ease;
  }
  @keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .modal-title { font-family: var(--font-head); font-size: 20px; font-weight: 800; margin-bottom: 24px; }
  .modal-form { display: flex; flex-direction: column; gap: 16px; }
  .modal-actions { display: flex; gap: 12px; margin-top: 8px; justify-content: flex-end; }

  /* EMPTY STATE */
  .empty-state { text-align: center; padding: 60px 20px; color: var(--muted); }
  .empty-state .empty-icon { font-size: 48px; margin-bottom: 16px; }
  .empty-state p { font-size: 15px; }

  /* LOADING */
  .loading { display: flex; align-items: center; justify-content: center; padding: 60px; }
  .spinner {
    width: 36px; height: 36px; border: 3px solid var(--border);
    border-top-color: var(--accent); border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* DELETE CONFIRM */
  .confirm-modal .modal { width: 380px; }
  .confirm-msg { color: var(--muted); font-size: 14px; margin-bottom: 24px; line-height: 1.6; }

  /* SEARCH HIGHLIGHT */
  .highlight { background: rgba(249,115,22,0.25); border-radius: 3px; padding: 0 2px; }

  @media (max-width: 900px) {
    .sidebar { width: 60px; }
    .sidebar-logo span:last-child, .nav-item span:not(.icon), .nav-label, .sidebar-bottom { display: none; }
    .main { margin-left: 60px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .form-grid { grid-template-columns: 1fr 1fr; }
  }
`;

// Toast component
function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === "success" ? "✅" : "❌"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("Products");
  const [toasts, setToasts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // product to delete
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "", image: "" });
  const [formErrors, setFormErrors] = useState({});
  const [orders, setOrders] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch {
      showToast("Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`);
      setOrders(res.data);
    } catch {}
  };

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) errs.price = "Valid price required";
    if (!formData.image.trim()) errs.image = "Image URL is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: "", image: "" });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, price: product.price, image: product.image });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingProduct(null); };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct._id}`, formData);
        showToast("Product updated successfully!");
      } else {
        await axios.post(`${API}/products`, formData);
        showToast("Product added successfully!");
      }
      closeModal();
      fetchProducts();
    } catch {
      showToast("Something went wrong", "error");
    }
  };

  const confirmDelete = (product) => setDeleteConfirm(product);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/products/${deleteConfirm._id}`);
      showToast("Product deleted");
      setDeleteConfirm(null);
      fetchProducts();
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const navItems = [
    { icon: "📊", label: "Dashboard" },
    { icon: "📦", label: "Products" },
    { icon: "🛒", label: "Orders" },
    { icon: "👥", label: "Customers" },
    { icon: "📈", label: "Analytics" },
  ];

  return (
    <>
      <style>{styles}</style>
      <Toast toasts={toasts} />

      <div className="dash-root">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <span>🛍️</span>
            <span>RetailShop</span>
          </div>
          <div className="nav-label">Menu</div>
          {navItems.map(item => (
            <div
              key={item.label}
              className={`nav-item ${activeNav === item.label ? "active" : ""}`}
              onClick={() => setActiveNav(item.label)}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <div className="sidebar-bottom">
            <button className="logout-btn">
              <span>🚪</span> Logout
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="main">
          {/* TOPBAR */}
          <div className="topbar">
            <div className="topbar-left">
              <h1>Admin Dashboard</h1>
              <p>Manage your retail store</p>
            </div>
            <div className="search-box">
              <span>🔍</span>
              <input
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* STATS */}
          <div className="stats-grid">
            {[
              { icon: "📦", value: products.length, label: "Total Products", color: "#f97316" },
              { icon: "🛒", value: orders.length || "—", label: "Total Orders", color: "#3b82f6" },
              { icon: "💰", value: revenue ? `₹${revenue.toLocaleString()}` : "—", label: "Revenue", color: "#22c55e" },
              { icon: "👥", value: "85+", label: "Customers", color: "#a855f7" },
            ].map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-glow" style={{ background: s.color }} />
                <span className="stat-icon">{s.icon}</span>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* PRODUCTS SECTION */}
          <div className="section-card">
            <div className="section-header">
              <div>
                <div className="section-title">Manage Products</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="badge">{filtered.length} items</span>
                <button className="btn btn-primary" onClick={openAddModal}>
                  ＋ Add Product
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>{search ? `No products matching "${search}"` : "No products yet. Add your first one!"}</p>
              </div>
            ) : (
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(product => (
                    <tr key={product._id}>
                      <td>
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="product-img"
                            onError={e => { e.target.style.display = "none"; }} />
                        ) : (
                          <div className="product-img-placeholder">📦</div>
                        )}
                      </td>
                      <td><span className="product-name">{product.name}</span></td>
                      <td><span className="product-price">₹{Number(product.price).toLocaleString()}</span></td>
                      <td>
                        <div className="actions">
                          <button className="btn btn-edit btn-sm" onClick={() => openEditModal(product)}>
                            ✏️ Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(product)}>
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              {editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  className="form-input"
                  placeholder="e.g. Fresh Mango"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                {formErrors.name && <span style={{ color: "var(--red)", fontSize: 12 }}>{formErrors.name}</span>}
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="e.g. 150"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
                {formErrors.price && <span style={{ color: "var(--red)", fontSize: 12 }}>{formErrors.price}</span>}
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  className="form-input"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                />
                {formErrors.image && <span style={{ color: "var(--red)", fontSize: 12 }}>{formErrors.image}</span>}
                {formData.image && (
                  <img src={formData.image} alt="preview" style={{ width: 60, height: 60, borderRadius: 8, marginTop: 8, objectFit: "cover", border: "1px solid var(--border)" }}
                    onError={e => e.target.style.display = "none"} />
                )}
              </div>
              <div className="modal-actions">
                <button className="btn btn-cancel" onClick={closeModal}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  {editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div className="modal-overlay confirm-modal" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">🗑️ Delete Product?</div>
            <p className="confirm-msg">
              Are you sure you want to delete <strong style={{ color: "var(--text)" }}>{deleteConfirm.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}