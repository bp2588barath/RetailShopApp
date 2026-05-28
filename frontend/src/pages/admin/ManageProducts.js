import React, { useEffect, useState } from "react";
import API from "../../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f0f13;
    --surface: #17171e;
    --surface2: #1e1e28;
    --border: #2a2a38;
    --accent: #f97316;
    --green: #22c55e;
    --red: #ef4444;
    --blue: #3b82f6;
    --yellow: #eab308;
    --text: #f1f1f3;
    --muted: #7c7c8a;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  .mp-root { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .mp-sidebar {
    width: 240px; min-height: 100vh; background: var(--surface);
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    padding: 28px 0; position: fixed; top: 0; left: 0; z-index: 100;
  }
  .mp-logo {
    font-family: var(--font-head); font-size: 20px; font-weight: 800;
    color: var(--accent); padding: 0 24px 32px;
    display: flex; align-items: center; gap: 10px;
  }
  .mp-nav-label {
    font-size: 10px; font-weight: 600; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1.5px; padding: 0 24px 10px;
  }
  .mp-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 24px; cursor: pointer; font-size: 14px; font-weight: 500;
    color: var(--muted); border-left: 3px solid transparent; transition: all 0.15s;
  }
  .mp-nav-item:hover { color: var(--text); background: var(--surface2); }
  .mp-nav-item.active { color: var(--accent); border-left-color: var(--accent); background: rgba(249,115,22,0.07); }
  .mp-sidebar-bottom { margin-top: auto; padding: 0 16px; }
  .mp-logout {
    width: 100%; padding: 11px 16px; border-radius: 10px;
    background: rgba(239,68,68,0.1); color: var(--red);
    border: 1px solid rgba(239,68,68,0.2); cursor: pointer;
    font-family: var(--font-body); font-size: 14px; font-weight: 500;
    display: flex; align-items: center; gap: 10px; transition: all 0.15s;
  }
  .mp-logout:hover { background: rgba(239,68,68,0.2); }

  /* MAIN */
  .mp-main { margin-left: 240px; flex: 1; padding: 32px; }

  /* TOPBAR */
  .mp-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
  .mp-topbar h1 { font-family: var(--font-head); font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .mp-topbar p { font-size: 13px; color: var(--muted); margin-top: 3px; }
  .mp-search {
    display: flex; align-items: center; gap: 10px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 16px; width: 260px;
  }
  .mp-search input {
    background: none; border: none; outline: none;
    color: var(--text); font-family: var(--font-body); font-size: 14px; width: 100%;
  }
  .mp-search input::placeholder { color: var(--muted); }

  /* STATS */
  .mp-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .mp-stat {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 20px; transition: transform 0.2s, border-color 0.2s;
  }
  .mp-stat:hover { transform: translateY(-2px); border-color: var(--accent); }
  .mp-stat-icon { font-size: 24px; margin-bottom: 10px; }
  .mp-stat-val { font-family: var(--font-head); font-size: 26px; font-weight: 800; }
  .mp-stat-label { font-size: 12px; color: var(--muted); margin-top: 3px; }

  /* LAYOUT */
  .mp-grid { display: grid; grid-template-columns: 400px 1fr; gap: 24px; align-items: start; }

  /* FORM CARD */
  .mp-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
  }
  .mp-card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px; border-bottom: 1px solid var(--border);
  }
  .mp-card-title { font-family: var(--font-head); font-size: 16px; font-weight: 700; }
  .mp-badge {
    background: rgba(249,115,22,0.12); color: var(--accent);
    border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600;
  }
  .mp-card-body { padding: 24px; }

  /* FORM */
  .mp-form { display: flex; flex-direction: column; gap: 14px; }
  .mp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .mp-group { display: flex; flex-direction: column; gap: 6px; }
  .mp-label { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.6px; }
  .mp-input {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; padding: 11px 14px; color: var(--text);
    font-family: var(--font-body); font-size: 14px; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s; width: 100%;
  }
  .mp-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
  .mp-input::placeholder { color: var(--muted); }
  .mp-input.err { border-color: var(--red); }
  .mp-err-msg { font-size: 11px; color: var(--red); }

  /* IMAGE PREVIEW */
  .mp-img-preview {
    width: 100%; height: 100px; border-radius: 10px; object-fit: cover;
    border: 1px solid var(--border); margin-top: 6px;
  }
  .mp-img-placeholder {
    width: 100%; height: 100px; border-radius: 10px;
    background: var(--surface2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; color: var(--muted); margin-top: 6px;
  }

  /* SUBMIT BTN */
  .mp-submit {
    width: 100%; padding: 13px; border-radius: 10px; border: none;
    background: var(--accent); color: white; cursor: pointer;
    font-family: var(--font-head); font-size: 15px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.15s; margin-top: 4px;
  }
  .mp-submit:hover:not(:disabled) { background: #fb923c; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(249,115,22,0.3); }
  .mp-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* PRODUCT TABLE */
  .mp-table { width: 100%; border-collapse: collapse; }
  .mp-table th {
    text-align: left; font-size: 11px; font-weight: 600; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1px;
    padding: 14px 20px; border-bottom: 1px solid var(--border);
  }
  .mp-table td {
    padding: 14px 20px; border-bottom: 1px solid rgba(42,42,56,0.5);
    font-size: 14px; vertical-align: middle;
  }
  .mp-table tr:last-child td { border-bottom: none; }
  .mp-table tr:hover td { background: rgba(249,115,22,0.03); }

  .mp-prod-img {
    width: 42px; height: 42px; border-radius: 9px; object-fit: cover;
    border: 1px solid var(--border);
  }
  .mp-prod-thumb {
    width: 42px; height: 42px; border-radius: 9px;
    background: var(--surface2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .mp-prod-name { font-weight: 600; }
  .mp-prod-cat { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .mp-price { font-family: var(--font-head); font-weight: 700; color: var(--accent); }

  /* STOCK BADGE */
  .mp-stock {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;
  }
  .stock-ok   { background: rgba(34,197,94,0.1);  color: var(--green); }
  .stock-low  { background: rgba(234,179,8,0.1);  color: var(--yellow); }
  .stock-out  { background: rgba(239,68,68,0.1);  color: var(--red); }

  /* ACTIONS */
  .mp-actions { display: flex; gap: 8px; }
  .mp-btn {
    padding: 7px 14px; border-radius: 8px; border: none; cursor: pointer;
    font-family: var(--font-body); font-size: 12px; font-weight: 600;
    display: inline-flex; align-items: center; gap: 5px; transition: all 0.15s;
  }
  .mp-btn-edit   { background: rgba(59,130,246,0.1); color: var(--blue); border: 1px solid rgba(59,130,246,0.2); }
  .mp-btn-edit:hover   { background: rgba(59,130,246,0.2); }
  .mp-btn-delete { background: rgba(239,68,68,0.1); color: var(--red);  border: 1px solid rgba(239,68,68,0.2); }
  .mp-btn-delete:hover { background: rgba(239,68,68,0.2); }

  /* EMPTY / LOADING */
  .mp-empty { text-align: center; padding: 60px 20px; color: var(--muted); }
  .mp-empty-icon { font-size: 48px; margin-bottom: 16px; }
  .mp-loading { display: flex; align-items: center; justify-content: center; padding: 60px; }
  .mp-spinner {
    width: 32px; height: 32px; border: 3px solid var(--border);
    border-top-color: var(--accent); border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* TOAST */
  .mp-toasts { position: fixed; top: 24px; right: 24px; z-index: 999; display: flex; flex-direction: column; gap: 10px; }
  .mp-toast {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 12px; padding: 14px 20px; font-size: 14px; font-weight: 500;
    display: flex; align-items: center; gap: 10px; min-width: 240px;
    animation: slideIn 0.3s ease; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .mp-toast.success { border-left: 3px solid var(--green); }
  .mp-toast.error   { border-left: 3px solid var(--red); }
  @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  /* MODAL */
  .mp-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    z-index: 200; display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .mp-modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 32px; width: 500px; max-width: 90vw;
    animation: popIn 0.25s ease;
  }
  @keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .mp-modal-title { font-family: var(--font-head); font-size: 20px; font-weight: 800; margin-bottom: 24px; }
  .mp-modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
  .mp-btn-cancel { padding: 10px 20px; border-radius: 10px; background: var(--surface2); color: var(--muted); border: 1px solid var(--border); cursor: pointer; font-family: var(--font-body); font-size: 14px; }

  /* DELETE CONFIRM */
  .mp-confirm-msg { color: var(--muted); font-size: 14px; line-height: 1.7; margin-bottom: 24px; }

  @media (max-width: 1100px) {
    .mp-grid { grid-template-columns: 1fr; }
    .mp-stats { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .mp-sidebar { width: 60px; }
    .mp-logo span:last-child, .mp-nav-item span:not(.icon), .mp-nav-label, .mp-sidebar-bottom { display: none; }
    .mp-main { margin-left: 60px; padding: 20px; }
  }
`;

const navItems = [
  { icon: "📊", label: "Dashboard" },
  { icon: "📦", label: "Products" },
  { icon: "🛒", label: "Orders" },
  { icon: "👥", label: "Customers" },
  { icon: "📈", label: "Analytics" },
];

const stockBadge = (stock) => {
  if (stock === undefined || stock === null) return null;
  if (stock === 0) return <span className="mp-stock stock-out">● Out of stock</span>;
  if (stock <= 5)  return <span className="mp-stock stock-low">● Low ({stock})</span>;
  return               <span className="mp-stock stock-ok">● {stock} in stock</span>;
};

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [errors, setErrors] = useState({});

  const emptyForm = { name: "", description: "", category: "", price: "", stock: "", imageUrl: "" };
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      setProducts(res.data);
    } catch {
      showToast("Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const validate = (data) => {
    const errs = {};
    if (!data.name.trim()) errs.name = "Required";
    if (!data.price || isNaN(data.price) || Number(data.price) <= 0) errs.price = "Valid price needed";
    if (!data.stock || isNaN(data.stock) || Number(data.stock) < 0) errs.stock = "Valid stock needed";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await API.post("/products/add", { ...form, price: Number(form.price), stock: Number(form.stock) });
      showToast("Product added successfully!");
      setForm(emptyForm);
      setErrors({});
      fetchProducts();
    } catch {
      showToast("Error adding product", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (p) => {
    setEditModal(p);
    setEditForm({ name: p.name, description: p.description || "", category: p.category || "", price: p.price, stock: p.stock, imageUrl: p.imageUrl || "" });
  };

  const saveEdit = async () => {
    const errs = validate(editForm);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      await API.put(`/products/${editModal._id}`, { ...editForm, price: Number(editForm.price), stock: Number(editForm.stock) });
      showToast("Product updated!");
      setEditModal(null);
      fetchProducts();
    } catch {
      showToast("Error updating product", "error");
    }
  };

  const deleteProduct = async () => {
    try {
      await API.delete(`/products/${deleteConfirm._id}`);
      showToast("Product deleted");
      setDeleteConfirm(null);
      fetchProducts();
    } catch {
      showToast("Error deleting product", "error");
    }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = products.reduce((s, p) => s + (Number(p.stock) || 0), 0);
  const lowStock   = products.filter(p => p.stock <= 5).length;
  const totalVal   = products.reduce((s, p) => s + (Number(p.price) * Number(p.stock) || 0), 0);

  const FormFields = ({ data, onChange, errs = {} }) => (
    <div className="mp-form">
      <div className="mp-form-row">
        <div className="mp-group">
          <label className="mp-label">Product Name *</label>
          <input className={`mp-input ${errs.name ? "err" : ""}`} name="name" placeholder="e.g. Fresh Mango" value={data.name} onChange={onChange} />
          {errs.name && <span className="mp-err-msg">⚠ {errs.name}</span>}
        </div>
        <div className="mp-group">
          <label className="mp-label">Category</label>
          <input className="mp-input" name="category" placeholder="e.g. Fruits" value={data.category} onChange={onChange} />
        </div>
      </div>
      <div className="mp-form-row">
        <div className="mp-group">
          <label className="mp-label">Price (₹) *</label>
          <input className={`mp-input ${errs.price ? "err" : ""}`} name="price" type="number" placeholder="e.g. 150" value={data.price} onChange={onChange} />
          {errs.price && <span className="mp-err-msg">⚠ {errs.price}</span>}
        </div>
        <div className="mp-group">
          <label className="mp-label">Stock *</label>
          <input className={`mp-input ${errs.stock ? "err" : ""}`} name="stock" type="number" placeholder="e.g. 50" value={data.stock} onChange={onChange} />
          {errs.stock && <span className="mp-err-msg">⚠ {errs.stock}</span>}
        </div>
      </div>
      <div className="mp-group">
        <label className="mp-label">Description</label>
        <input className="mp-input" name="description" placeholder="Short description..." value={data.description} onChange={onChange} />
      </div>
      <div className="mp-group">
        <label className="mp-label">Image URL</label>
        <input className="mp-input" name="imageUrl" placeholder="https://..." value={data.imageUrl} onChange={onChange} />
        {data.imageUrl
          ? <img src={data.imageUrl} alt="preview" className="mp-img-preview" onError={e => e.target.style.display = "none"} />
          : <div className="mp-img-placeholder">🖼️</div>
        }
      </div>
    </div>
  );

  return (
    <>
      <style>{styles}</style>

      {/* TOASTS */}
      <div className="mp-toasts">
        {toasts.map(t => (
          <div key={t.id} className={`mp-toast ${t.type}`}>
            <span>{t.type === "success" ? "✅" : "❌"}</span>{t.message}
          </div>
        ))}
      </div>

      <div className="mp-root">
        {/* SIDEBAR */}
        <div className="mp-sidebar">
          <div className="mp-logo"><span>🛍️</span><span>RetailShop</span></div>
          <div className="mp-nav-label">Menu</div>
          {navItems.map(item => (
            <div key={item.label} className={`mp-nav-item ${item.label === "Products" ? "active" : ""}`}>
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <div className="mp-sidebar-bottom">
            <button className="mp-logout"><span>🚪</span> Logout</button>
          </div>
        </div>

        {/* MAIN */}
        <div className="mp-main">
          {/* TOPBAR */}
          <div className="mp-topbar">
            <div>
              <h1>Manage Products</h1>
              <p>Add, edit, and remove your store products</p>
            </div>
            <div className="mp-search">
              <span>🔍</span>
              <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* STATS */}
          <div className="mp-stats">
            {[
              { icon: "📦", val: products.length, label: "Total Products" },
              { icon: "🏷️", val: totalStock,       label: "Total Stock" },
              { icon: "⚠️", val: lowStock,         label: "Low Stock" },
              { icon: "💰", val: `₹${totalVal.toLocaleString()}`, label: "Inventory Value" },
            ].map((s, i) => (
              <div className="mp-stat" key={i}>
                <div className="mp-stat-icon">{s.icon}</div>
                <div className="mp-stat-val">{s.val}</div>
                <div className="mp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="mp-grid">
            {/* ADD FORM */}
            <div className="mp-card">
              <div className="mp-card-header">
                <span className="mp-card-title">➕ Add New Product</span>
              </div>
              <div className="mp-card-body">
                <form onSubmit={addProduct}>
                  <FormFields data={form} onChange={handleChange} errs={errors} />
                  <button className="mp-submit" type="submit" disabled={submitting} style={{ marginTop: 20 }}>
                    {submitting ? "Adding..." : "Add Product"}
                  </button>
                </form>
              </div>
            </div>

            {/* PRODUCT LIST */}
            <div className="mp-card">
              <div className="mp-card-header">
                <span className="mp-card-title">Product List</span>
                <span className="mp-badge">{filtered.length} items</span>
              </div>
              {loading ? (
                <div className="mp-loading"><div className="mp-spinner" /></div>
              ) : filtered.length === 0 ? (
                <div className="mp-empty">
                  <div className="mp-empty-icon">📭</div>
                  <p>{search ? `No products matching "${search}"` : "No products yet. Add your first one!"}</p>
                </div>
              ) : (
                <table className="mp-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p._id}>
                        <td>
                          {p.imageUrl
                            ? <img src={p.imageUrl} alt={p.name} className="mp-prod-img" onError={e => e.target.style.display = "none"} />
                            : <div className="mp-prod-thumb">📦</div>
                          }
                        </td>
                        <td>
                          <div className="mp-prod-name">{p.name}</div>
                          <div className="mp-prod-cat">{p.category || "—"}</div>
                        </td>
                        <td><span className="mp-price">₹{Number(p.price).toLocaleString()}</span></td>
                        <td>{stockBadge(p.stock)}</td>
                        <td>
                          <div className="mp-actions">
                            <button className="mp-btn mp-btn-edit" onClick={() => openEdit(p)}>✏️ Edit</button>
                            <button className="mp-btn mp-btn-delete" onClick={() => setDeleteConfirm(p)}>🗑️ Delete</button>
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
      </div>

      {/* EDIT MODAL */}
      {editModal && (
        <div className="mp-overlay" onClick={() => setEditModal(null)}>
          <div className="mp-modal" onClick={e => e.stopPropagation()}>
            <div className="mp-modal-title">✏️ Edit Product</div>
            <FormFields
              data={editForm}
              onChange={e => setEditForm({ ...editForm, [e.target.name]: e.target.value })}
              errs={errors}
            />
            <div className="mp-modal-actions">
              <button className="mp-btn-cancel" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="mp-submit" style={{ width: "auto", padding: "10px 24px", marginTop: 0 }} onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div className="mp-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="mp-modal" onClick={e => e.stopPropagation()}>
            <div className="mp-modal-title">🗑️ Delete Product?</div>
            <p className="mp-confirm-msg">
              Are you sure you want to delete <strong style={{ color: "var(--text)" }}>{deleteConfirm.name}</strong>?
              This cannot be undone.
            </p>
            <div className="mp-modal-actions">
              <button className="mp-btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="mp-btn mp-btn-delete" style={{ padding: "10px 20px" }} onClick={deleteProduct}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}