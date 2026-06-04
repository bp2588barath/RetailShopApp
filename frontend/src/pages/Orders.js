import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

const STATUS_CONFIG = {
  Pending:   { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", icon: "🕐", step: 1 },
  Confirmed: { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", icon: "✅", step: 2 },
  Shipped:   { color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", icon: "🚚", step: 3 },
  Delivered: { color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", icon: "📦", step: 4 },
  Cancelled: { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: "❌", step: 0 },
};

const STEPS = ["Confirmed", "Shipped", "Delivered"];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      {cfg.icon} {status}
    </span>
  );
}

function ProgressBar({ status }) {
  if (status === "Cancelled") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 0 4px" }}>
      <span style={{ fontSize: 13, color: "#ef4444", fontWeight: 600 }}>❌ Order Cancelled</span>
    </div>
  );
  const currentStep = STATUS_CONFIG[status]?.step || 1;
  return (
    <div style={{ padding: "14px 0 4px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {STEPS.map((s, i) => {
          const stepNum = i + 2;
          const done = currentStep >= stepNum;
          const active = currentStep === stepNum;
          return (
            <React.Fragment key={s}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
                  background: done ? "#2563eb" : "#e5e7eb",
                  color: done ? "#fff" : "#9ca3af",
                  border: active ? "2px solid #93c5fd" : "none",
                  transition: "all 0.3s",
                }}>
                  {done && !active ? "✓" : stepNum - 1}
                </div>
                <span style={{ fontSize: 10, color: done ? "#2563eb" : "#9ca3af", fontWeight: done ? 600 : 400, whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, margin: "0 4px", marginBottom: 16, background: currentStep > stepNum ? "#2563eb" : "#e5e7eb", transition: "background 0.3s" }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({ order, expanded, onToggle }) {
  const date = new Date(order.createdAt);
  const dateStr = isNaN(date) ? "Recently" : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const timeStr = isNaN(date) ? "" : date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const shortId = order._id?.slice(-8).toUpperCase() || "--------";

  return (
    <div style={{
      background: "#fff", borderRadius: 14, overflow: "hidden",
      border: "1px solid #e5e7eb", marginBottom: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "box-shadow 0.2s",
    }}>
      {/* Header row */}
      <div
        onClick={onToggle}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", cursor: "pointer", gap: 12, flexWrap: "wrap",
          borderBottom: expanded ? "1px solid #f3f4f6" : "none",
          background: expanded ? "#fafafa" : "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: "#eff6ff",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
          }}>🧾</div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111" }}>
              Order #{shortId}
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>
              {dateStr} {timeStr && `· ${timeStr}`} · {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <StatusBadge status={order.orderStatus || "Pending"} />
          <span style={{ fontWeight: 800, fontSize: 16, color: "#111" }}>
            ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
          </span>
          <span style={{ fontSize: 18, color: "#9ca3af", transition: "transform 0.2s", display: "inline-block", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
            ▾
          </span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: "16px 20px", animation: "fadeDown 0.2s ease" }}>

          {/* Progress tracker */}
          <ProgressBar status={order.orderStatus || "Pending"} />

          <div style={{ height: 1, background: "#f3f4f6", margin: "14px 0" }} />

          {/* Items list */}
          <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Items Ordered
          </h4>
          {(order.items || []).map((item, idx) => (
            <div key={item._id || idx} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 0", borderBottom: idx < order.items.length - 1 ? "1px solid #f9fafb" : "none", gap: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 8, background: "#f3f4f6",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
                }}>
                  {item.image
                    ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                    : "📦"}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111" }}>{item.name || "Product"}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>Qty: {item.quantity}</p>
                </div>
              </div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111" }}>
                ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
              </p>
            </div>
          ))}

          <div style={{ height: 1, background: "#f3f4f6", margin: "14px 0" }} />

          {/* Price breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "Subtotal", value: `₹${(order.totalAmount || 0).toLocaleString("en-IN")}` },
              { label: "Delivery", value: "FREE", green: true },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#6b7280" }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: r.green ? "#10b981" : "#111" }}>{r.value}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #f3f4f6", marginTop: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>Total Paid</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#2563eb" }}>₹{(order.totalAmount || 0).toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Payment method */}
          {order.paymentMethod && (
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>
                {order.paymentMethod === "COD" ? "💵" : order.paymentMethod === "UPI" ? "📱" : "💳"}
              </span>
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                Paid via <strong style={{ color: "#374151" }}>{order.paymentMethod}</strong>
              </span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            {order.orderStatus === "Delivered" && (
              <button style={{
                padding: "9px 18px", background: "#2563eb", color: "#fff",
                border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>
                ⭐ Rate & Review
              </button>
            )}
            {(order.orderStatus === "Pending" || order.orderStatus === "Confirmed") && (
              <button style={{
                padding: "9px 18px", background: "#fff", color: "#ef4444",
                border: "1px solid #fecaca", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>
                Cancel Order
              </button>
            )}
            <button style={{
              padding: "9px 18px", background: "#f9fafb", color: "#374151",
              border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              🛒 Buy Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
export default function Orders() {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter]       = useState("All");
  const [search, setSearch]       = useState("");

  useEffect(() => {
    API.get("/orders")
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => { setError("Failed to load orders. Please try again."); setLoading(false); });
  }, []);

  const statuses = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

  const filtered = orders.filter(o => {
    const matchFilter = filter === "All" || o.orderStatus === filter;
    const matchSearch = !search || o._id?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = statuses.reduce((acc, s) => {
    acc[s] = s === "All" ? orders.length : orders.filter(o => o.orderStatus === s).length;
    return acc;
  }, {});

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes fadeDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .tab-btn:hover { background:#f3f4f6 !important; }
      `}</style>

      <Navbar />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1rem" }}>

        {/* Page title */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: "#111" }}>My Orders</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#9ca3af" }}>
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </p>
        </div>

        {/* Stats strip */}
        {orders.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: "1.5rem" }}>
            {[
              { label: "Total Orders", value: counts.All, icon: "🧾" },
              { label: "Delivered",    value: counts.Delivered || 0, icon: "📦" },
              { label: "In Transit",   value: (counts.Confirmed || 0) + (counts.Shipped || 0), icon: "🚚" },
              { label: "Cancelled",    value: counts.Cancelled || 0, icon: "❌" },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                <p style={{ margin: "0 0 4px", fontSize: 20 }}>{s.icon}</p>
                <p style={{ margin: "0 0 2px", fontSize: 20, fontWeight: 800, color: "#111" }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filter tabs + Search */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: "1rem", border: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {statuses.map(s => {
              const active = filter === s;
              const cfg = STATUS_CONFIG[s];
              return (
                <button key={s} className="tab-btn" onClick={() => setFilter(s)} style={{
                  padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                  border: `1px solid ${active ? (cfg?.border || "#bfdbfe") : "#e5e7eb"}`,
                  background: active ? (cfg?.bg || "#eff6ff") : "#fff",
                  color: active ? (cfg?.color || "#1d4ed8") : "#6b7280",
                  cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  {cfg?.icon || "🏪"} {s}
                  {counts[s] > 0 && <span style={{ background: active ? (cfg?.color || "#1d4ed8") : "#e5e7eb", color: active ? "#fff" : "#6b7280", borderRadius: 100, padding: "1px 7px", fontSize: 11 }}>{counts[s]}</span>}
                </button>
              );
            })}
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Search by order ID…"
            style={{
              width: "100%", padding: "9px 14px", borderRadius: 8, border: "1px solid #e5e7eb",
              fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#111",
            }}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4rem", gap: 12 }}>
            <div style={{ width: 36, height: 36, border: "3px solid #e5e7eb", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ color: "#6b7280", fontSize: 14 }}>Loading your orders…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "1.5rem", textAlign: "center" }}>
            <p style={{ fontSize: 32, margin: "0 0 8px" }}>⚠️</p>
            <p style={{ margin: "0 0 12px", color: "#b91c1c", fontWeight: 600 }}>{error}</p>
            <button onClick={() => window.location.reload()} style={{ padding: "8px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb" }}>
            <p style={{ fontSize: 52, margin: "0 0 12px" }}>📭</p>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "#374151" }}>
              {filter === "All" ? "No orders yet" : `No ${filter} orders`}
            </h3>
            <p style={{ margin: "0 0 20px", color: "#9ca3af", fontSize: 14 }}>
              {filter === "All" ? "When you place an order, it will appear here." : `You have no orders with status "${filter}".`}
            </p>
            {filter !== "All"
              ? <button onClick={() => setFilter("All")} style={{ padding: "10px 24px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 14 }}>View all orders</button>
              : <a href="/" style={{ padding: "10px 24px", background: "#2563eb", color: "#fff", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Start Shopping →</a>
            }
          </div>
        )}

        {/* Order cards */}
        {!loading && !error && filtered.map(order => (
          <OrderCard
            key={order._id}
            order={order}
            expanded={expandedId === order._id}
            onToggle={() => setExpandedId(id => id === order._id ? null : order._id)}
          />
        ))}
      </div>
    </div>
  );
}