import React, { useEffect, useState } from "react";
import axios from "axios";

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
    --yellow: #eab308;
    --blue: #3b82f6;
    --red: #ef4444;
    --purple: #a855f7;
    --text: #f1f1f3;
    --muted: #7c7c8a;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  .mo-root { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .mo-sidebar {
    width: 240px; min-height: 100vh; background: var(--surface);
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    padding: 28px 0; position: fixed; top: 0; left: 0; z-index: 100;
  }
  .mo-logo {
    font-family: var(--font-head); font-size: 20px; font-weight: 800;
    color: var(--accent); padding: 0 24px 32px;
    display: flex; align-items: center; gap: 10px;
  }
  .mo-nav-label {
    font-size: 10px; font-weight: 600; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1.5px; padding: 0 24px 10px;
  }
  .mo-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 24px; cursor: pointer; font-size: 14px; font-weight: 500;
    color: var(--muted); border-left: 3px solid transparent; transition: all 0.15s;
  }
  .mo-nav-item:hover { color: var(--text); background: var(--surface2); }
  .mo-nav-item.active { color: var(--accent); border-left-color: var(--accent); background: rgba(249,115,22,0.07); }
  .mo-sidebar-bottom { margin-top: auto; padding: 0 16px; }
  .mo-logout {
    width: 100%; padding: 11px 16px; border-radius: 10px;
    background: rgba(239,68,68,0.1); color: var(--red);
    border: 1px solid rgba(239,68,68,0.2); cursor: pointer;
    font-family: var(--font-body); font-size: 14px; font-weight: 500;
    display: flex; align-items: center; gap: 10px; transition: all 0.15s;
  }
  .mo-logout:hover { background: rgba(239,68,68,0.2); }

  /* MAIN */
  .mo-main { margin-left: 240px; flex: 1; padding: 32px; }

  /* TOPBAR */
  .mo-topbar {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px;
  }
  .mo-topbar h1 { font-family: var(--font-head); font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .mo-topbar p { font-size: 13px; color: var(--muted); margin-top: 3px; }
  .mo-search {
    display: flex; align-items: center; gap: 10px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 16px; width: 260px;
  }
  .mo-search input {
    background: none; border: none; outline: none;
    color: var(--text); font-family: var(--font-body); font-size: 14px; width: 100%;
  }
  .mo-search input::placeholder { color: var(--muted); }

  /* STATS */
  .mo-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .mo-stat {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 20px; transition: transform 0.2s, border-color 0.2s;
  }
  .mo-stat:hover { transform: translateY(-2px); border-color: var(--accent); }
  .mo-stat-icon { font-size: 24px; margin-bottom: 10px; }
  .mo-stat-val { font-family: var(--font-head); font-size: 26px; font-weight: 800; }
  .mo-stat-label { font-size: 12px; color: var(--muted); margin-top: 3px; }

  /* FILTERS */
  .mo-filters { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .mo-filter-btn {
    padding: 7px 16px; border-radius: 20px; border: 1px solid var(--border);
    background: var(--surface); color: var(--muted); font-family: var(--font-body);
    font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center; gap: 6px;
  }
  .mo-filter-btn:hover { color: var(--text); border-color: var(--accent); }
  .mo-filter-btn.active { background: var(--accent); color: white; border-color: var(--accent); }

  /* TABLE CARD */
  .mo-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
  }
  .mo-card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px; border-bottom: 1px solid var(--border);
  }
  .mo-card-title { font-family: var(--font-head); font-size: 16px; font-weight: 700; }
  .mo-badge {
    background: rgba(249,115,22,0.12); color: var(--accent);
    border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600;
  }

  /* TABLE */
  .mo-table { width: 100%; border-collapse: collapse; }
  .mo-table th {
    text-align: left; font-size: 11px; font-weight: 600; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1px;
    padding: 14px 20px; border-bottom: 1px solid var(--border);
  }
  .mo-table td {
    padding: 16px 20px; border-bottom: 1px solid rgba(42,42,56,0.5);
    font-size: 14px; vertical-align: middle;
  }
  .mo-table tr:last-child td { border-bottom: none; }
  .mo-table tr { transition: background 0.1s; }
  .mo-table tr:hover td { background: rgba(249,115,22,0.03); }

  /* ORDER ID */
  .mo-order-id { font-family: monospace; font-size: 12px; color: var(--muted); }

  /* CUSTOMER */
  .mo-customer { display: flex; align-items: center; gap: 10px; }
  .mo-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), #fb923c);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: white; flex-shrink: 0;
  }
  .mo-customer-name { font-weight: 600; }
  .mo-customer-email { font-size: 12px; color: var(--muted); }

  /* STATUS BADGE */
  .mo-status {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
  }
  .mo-status-dot { width: 6px; height: 6px; border-radius: 50%; }
  .status-pending    { background: rgba(234,179,8,0.12);  color: var(--yellow); }
  .status-pending .mo-status-dot    { background: var(--yellow); }
  .status-shipped    { background: rgba(59,130,246,0.12); color: var(--blue); }
  .status-shipped .mo-status-dot    { background: var(--blue); }
  .status-delivered  { background: rgba(34,197,94,0.12);  color: var(--green); }
  .status-delivered .mo-status-dot  { background: var(--green); }
  .status-cancelled  { background: rgba(239,68,68,0.12);  color: var(--red); }
  .status-cancelled .mo-status-dot  { background: var(--red); }

  /* PRICE */
  .mo-price { font-family: var(--font-head); font-weight: 700; color: var(--accent); }

  /* ACTION BUTTONS */
  .mo-actions { display: flex; gap: 8px; }
  .mo-btn {
    padding: 7px 14px; border-radius: 8px; border: none; cursor: pointer;
    font-family: var(--font-body); font-size: 12px; font-weight: 600;
    display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s;
  }
  .mo-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-ship     { background: rgba(59,130,246,0.12); color: var(--blue);  border: 1px solid rgba(59,130,246,0.2); }
  .btn-ship:hover:not(:disabled)     { background: rgba(59,130,246,0.22); }
  .btn-deliver  { background: rgba(34,197,94,0.12);  color: var(--green); border: 1px solid rgba(34,197,94,0.2); }
  .btn-deliver:hover:not(:disabled)  { background: rgba(34,197,94,0.22); }
  .btn-cancel-o { background: rgba(239,68,68,0.1);   color: var(--red);   border: 1px solid rgba(239,68,68,0.2); }
  .btn-cancel-o:hover:not(:disabled) { background: rgba(239,68,68,0.2); }

  /* EMPTY / LOADING */
  .mo-empty { text-align: center; padding: 60px 20px; color: var(--muted); }
  .mo-empty-icon { font-size: 48px; margin-bottom: 16px; }
  .mo-loading { display: flex; align-items: center; justify-content: center; padding: 60px; }
  .mo-spinner {
    width: 36px; height: 36px; border: 3px solid var(--border);
    border-top-color: var(--accent); border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* TOAST */
  .mo-toast-wrap { position: fixed; top: 24px; right: 24px; z-index: 999; display: flex; flex-direction: column; gap: 10px; }
  .mo-toast {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 12px; padding: 14px 20px; font-size: 14px; font-weight: 500;
    display: flex; align-items: center; gap: 10px; min-width: 240px;
    animation: slideIn 0.3s ease; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .mo-toast.success { border-left: 3px solid var(--green); }
  .mo-toast.error   { border-left: 3px solid var(--red); }
  @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  @media (max-width: 900px) {
    .mo-sidebar { width: 60px; }
    .mo-logo span:last-child, .mo-nav-item span:not(.icon), .mo-nav-label, .mo-sidebar-bottom { display: none; }
    .mo-main { margin-left: 60px; padding: 20px; }
    .mo-stats { grid-template-columns: repeat(2, 1fr); }
  }
`;

const STATUS_FLOW = ["Pending", "Shipped", "Delivered"];

const statusClass = (s) => {
  if (!s) return "";
  const map = { pending: "status-pending", shipped: "status-shipped", delivered: "status-delivered", cancelled: "status-cancelled" };
  return map[s.toLowerCase()] || "";
};

const statusIcon = (s = "") => {
  const map = { pending: "⏳", shipped: "🚚", delivered: "✅", cancelled: "❌" };
  return map[s.toLowerCase()] || "📦";
};

function Toast({ toasts }) {
  return (
    <div className="mo-toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`mo-toast ${t.type}`}>
          <span>{t.type === "success" ? "✅" : "❌"}</span>{t.message}
        </div>
      ))}
    </div>
  );
}

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // order id being updated
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch {
      showToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status });
      showToast(`Order marked as ${status}`);
      fetchOrders();
    } catch {
      showToast("Failed to update order", "error");
    } finally {
      setUpdating(null);
    }
  };

  // Stats
  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status?.toLowerCase() === "pending").length,
    shipped: orders.filter(o => o.status?.toLowerCase() === "shipped").length,
    delivered: orders.filter(o => o.status?.toLowerCase() === "delivered").length,
  };
  const revenue = orders
    .filter(o => o.status?.toLowerCase() === "delivered")
    .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

  // Filter + search
  const filtered = orders.filter(o => {
    const matchFilter = filter === "All" || o.status?.toLowerCase() === filter.toLowerCase();
    const matchSearch =
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.productName?.toLowerCase().includes(search.toLowerCase()) ||
      o._id?.includes(search);
    return matchFilter && matchSearch;
  });

  const initials = (name = "") => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

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

      <div className="mo-root">
        {/* SIDEBAR */}
        <div className="mo-sidebar">
          <div className="mo-logo"><span>🛍️</span><span>RetailShop</span></div>
          <div className="mo-nav-label">Menu</div>
          {navItems.map(item => (
            <div key={item.label} className={`mo-nav-item ${item.label === "Orders" ? "active" : ""}`}>
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <div className="mo-sidebar-bottom">
            <button className="mo-logout"><span>🚪</span> Logout</button>
          </div>
        </div>

        {/* MAIN */}
        <div className="mo-main">
          {/* TOPBAR */}
          <div className="mo-topbar">
            <div>
              <h1>Manage Orders</h1>
              <p>Track and update all customer orders</p>
            </div>
            <div className="mo-search">
              <span>🔍</span>
              <input
                placeholder="Search orders, customers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* STATS */}
          <div className="mo-stats">
            {[
              { icon: "🛒", val: counts.all,       label: "Total Orders" },
              { icon: "⏳", val: counts.pending,    label: "Pending" },
              { icon: "🚚", val: counts.shipped,    label: "Shipped" },
              { icon: "✅", val: counts.delivered,  label: "Delivered" },
            ].map((s, i) => (
              <div className="mo-stat" key={i}>
                <div className="mo-stat-icon">{s.icon}</div>
                <div className="mo-stat-val">{s.val}</div>
                <div className="mo-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* FILTER TABS */}
          <div className="mo-filters">
            {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map(f => (
              <button
                key={f}
                className={`mo-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {statusIcon(f === "All" ? "" : f)} {f}
                {f === "All" && <span style={{ opacity: 0.6 }}>({counts.all})</span>}
              </button>
            ))}
          </div>

          {/* TABLE */}
          <div className="mo-card">
            <div className="mo-card-header">
              <span className="mo-card-title">Orders List</span>
              <span className="mo-badge">{filtered.length} orders</span>
            </div>

            {loading ? (
              <div className="mo-loading"><div className="mo-spinner" /></div>
            ) : filtered.length === 0 ? (
              <div className="mo-empty">
                <div className="mo-empty-icon">📭</div>
                <p>{search ? `No orders matching "${search}"` : `No ${filter.toLowerCase()} orders found`}</p>
              </div>
            ) : (
              <table className="mo-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => {
                    const st = order.status?.toLowerCase() || "pending";
                    const isDelivered = st === "delivered";
                    const isCancelled = st === "cancelled";
                    const isShipped   = st === "shipped";
                    const isPending   = st === "pending";

                    return (
                      <tr key={order._id}>
                        <td>
                          <span className="mo-order-id">#{order._id?.slice(-6).toUpperCase()}</span>
                        </td>
                        <td>
                          <div className="mo-customer">
                            <div className="mo-avatar">{initials(order.customerName)}</div>
                            <div>
                              <div className="mo-customer-name">{order.customerName || "—"}</div>
                            </div>
                          </div>
                        </td>
                        <td>{order.productName || "—"}</td>
                        <td>
                          <span className="mo-price">₹{Number(order.totalPrice || 0).toLocaleString()}</span>
                        </td>
                        <td>
                          <span className={`mo-status ${statusClass(order.status)}`}>
                            <span className="mo-status-dot" />
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          <div className="mo-actions">
                            <button
                              className="mo-btn btn-ship"
                              disabled={isShipped || isDelivered || isCancelled || updating === order._id + "Shipped"}
                              onClick={() => updateStatus(order._id, "Shipped")}
                            >
                              🚚 Ship
                            </button>
                            <button
                              className="mo-btn btn-deliver"
                              disabled={isDelivered || isCancelled || isPending || updating === order._id + "Delivered"}
                              onClick={() => updateStatus(order._id, "Delivered")}
                            >
                              ✅ Deliver
                            </button>
                            <button
                              className="mo-btn btn-cancel-o"
                              disabled={isDelivered || isCancelled || updating === order._id + "Cancelled"}
                              onClick={() => updateStatus(order._id, "Cancelled")}
                            >
                              ❌
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}