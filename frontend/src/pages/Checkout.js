import React, { useEffect, useCallback, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

/* ── Toast helper ── */
function Toast({ message, type }) {
  return message ? (
    <div style={{
      position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
      background: type === "error" ? "#ef4444" : "#16a34a",
      color: "#fff", padding: "12px 24px", borderRadius: "100px",
      fontSize: "14px", fontWeight: 500, zIndex: 9999,
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      animation: "slideUp 0.3s ease",
    }}>
      {type === "error" ? "⚠️" : "✅"} {message}
    </div>
  ) : null;
}

/* ── Step indicator ── */
function Steps({ current }) {
  const steps = ["Cart", "Checkout", "Confirmed"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "2rem" }}>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i < current ? "#16a34a" : i === current ? "#2563eb" : "#e5e7eb",
              color: i <= current ? "#fff" : "#9ca3af",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, transition: "all 0.3s",
            }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 11, color: i === current ? "#2563eb" : "#9ca3af", fontWeight: i === current ? 600 : 400 }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < current ? "#16a34a" : "#e5e7eb", margin: "0 6px", marginBottom: 16, transition: "background 0.3s" }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Cart item row ── */
function CartItem({ item }) {
  const name = item.productId?.name || "Product";
  const price = item.productId?.price || 0;
  const img = item.productId?.image;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 0", borderBottom: "1px solid #f3f4f6",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 10, overflow: "hidden",
        background: "#f9fafb", border: "1px solid #e5e7eb", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
      }}>
        {img ? <img src={img} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📦"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</p>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Qty: {item.quantity}</p>
      </div>
      <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#111" }}>
        ₹{(price * item.quantity).toLocaleString("en-IN")}
      </p>
    </div>
  );
}

/* ── Address field ── */
function Field({ label, name, value, onChange, error, type = "text", half }) {
  return (
    <div style={{ width: half ? "calc(50% - 6px)" : "100%" }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: "100%", padding: "10px 14px", fontSize: 14,
          border: `1.5px solid ${error ? "#ef4444" : "#d1d5db"}`,
          borderRadius: 8, outline: "none", boxSizing: "border-box",
          background: "#fff", color: "#111", transition: "border 0.2s",
          fontFamily: "inherit",
        }}
        onFocus={e => e.target.style.borderColor = "#2563eb"}
        onBlur={e => e.target.style.borderColor = error ? "#ef4444" : "#d1d5db"}
      />
      {error && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#ef4444" }}>{error}</p>}
    </div>
  );
}

/* ── Payment option ── */
function PayOption({ id, selected, onSelect, icon, label, desc }) {
  return (
    <div
      onClick={() => onSelect(id)}
      style={{
        display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
        border: `2px solid ${selected ? "#2563eb" : "#e5e7eb"}`,
        borderRadius: 10, cursor: "pointer", background: selected ? "#eff6ff" : "#fff",
        transition: "all 0.2s", marginBottom: 10,
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#111" }}>{label}</p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>{desc}</p>
      </div>
      <div style={{
        width: 18, height: 18, borderRadius: "50%",
        border: `2px solid ${selected ? "#2563eb" : "#d1d5db"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
      }}>
        {selected && <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#2563eb" }} />}
      </div>
    </div>
  );
}

/* ── Success screen ── */
function SuccessScreen({ orderId, onViewOrders }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: "2rem",
      animation: "fadeIn 0.5s ease",
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%", background: "#dcfce7",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 36, marginBottom: 24, animation: "pop 0.4s ease",
      }}>✅</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111", margin: "0 0 8px" }}>Order Placed!</h2>
      <p style={{ color: "#6b7280", fontSize: 15, margin: "0 0 8px" }}>
        Your order has been confirmed successfully.
      </p>
      <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 28px" }}>
        Order ID: <strong style={{ color: "#374151" }}>#{orderId?.slice(-8).toUpperCase()}</strong>
      </p>
      <button
        onClick={onViewOrders}
        style={{
          padding: "13px 32px", background: "#2563eb", color: "#fff",
          border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600,
          cursor: "pointer", transition: "background 0.2s",
        }}
        onMouseEnter={e => e.target.style.background = "#1d4ed8"}
        onMouseLeave={e => e.target.style.background = "#2563eb"}
      >
        View My Orders →
      </button>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN CHECKOUT COMPONENT
══════════════════════════════════════ */
export default function Checkout() {
  const navigate = useNavigate();
  const customerId = localStorage.getItem("userId");

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState(1);           // 1=checkout, 2=confirmed
  const [orderId, setOrderId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [payMethod, setPayMethod] = useState("COD");

  const [address, setAddress] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", pincode: "",
  });
  const [errors, setErrors] = useState({});

  /* ── Fetch cart ── */
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/cart/${customerId}`);
      setCart(res.data);
    } catch (err) {
      showToast("Failed to load cart. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  /* ── Toast helper ── */
  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  }

  /* ── Address change handler ── */
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  /* ── Validate address ── */
  function validate() {
    const newErrors = {};
    if (!address.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!/^\d{10}$/.test(address.phone)) newErrors.phone = "Enter a valid 10-digit phone";
    if (!address.street.trim()) newErrors.street = "Street address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state.trim()) newErrors.state = "State is required";
    if (!/^\d{6}$/.test(address.pincode)) newErrors.pincode = "Enter a valid 6-digit PIN";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /* ── Place order ── */
  const placeOrder = async () => {
    if (!validate()) {
      showToast("Please fix the errors above", "error");
      return;
    }
    try {
      setPlacing(true);
      const items = cart.items.map((i) => ({
        productId: i.productId._id,
        quantity: i.quantity,
      }));
      const res = await API.post("/orders/create", {
        customerId,
        items,
        paymentMethod: payMethod,
        deliveryAddress: address,
      });
      setOrderId(res.data._id || res.data.orderId || "NEW");
      setStep(2);
      showToast("Order placed successfully!");
    } catch (err) {
      showToast("Failed to place order. Please try again.", "error");
    } finally {
      setPlacing(false);
    }
  };

  /* ── Price calculations ── */
  const subtotal = cart?.items?.reduce((s, i) => s + (i.productId?.price || 0) * i.quantity, 0) || 0;
  const delivery = subtotal > 499 ? 0 : 49;
  const total = subtotal + delivery;

  /* ════════ RENDER ════════ */

  if (loading) return (
    <div>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16 }}>
        <div style={{
          width: 40, height: 40, border: "3px solid #e5e7eb",
          borderTop: "3px solid #2563eb", borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ color: "#6b7280", fontSize: 14 }}>Loading your cart…</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh" }}>
      <Navbar />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateX(-50%) translateY(20px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pop { 0% { transform: scale(0.5); } 80% { transform: scale(1.1); } 100% { transform: scale(1); } }
      `}</style>

      <Toast message={toast.message} type={toast.type} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        <Steps current={step} />

        {/* ── SUCCESS SCREEN ── */}
        {step === 2 ? (
          <SuccessScreen orderId={orderId} onViewOrders={() => navigate("/orders")} />
        ) : (
          <>
            {/* ── EMPTY CART ── */}
            {cart?.items?.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
                <p style={{ fontSize: 48, margin: "0 0 16px" }}>🛒</p>
                <h3 style={{ fontSize: 20, color: "#374151" }}>Your cart is empty</h3>
                <button onClick={() => navigate("/")} style={{ marginTop: 16, padding: "10px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.5rem", alignItems: "start" }}>

                {/* ── LEFT COLUMN ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                  {/* Cart items */}
                  <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#111" }}>
                      🛍️ Your items ({cart.items.length})
                    </h3>
                    <p style={{ margin: "0 0 12px", fontSize: 13, color: "#9ca3af" }}>
                      {subtotal > 499 ? "🎉 You qualify for free delivery!" : `Add ₹${499 - subtotal} more for free delivery`}
                    </p>
                    {cart.items.map((item) => (
                      <CartItem key={item._id} item={item} />
                    ))}
                  </div>

                  {/* Address form */}
                  <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#111" }}>📍 Delivery Address</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                      <Field label="Full Name *" name="fullName" value={address.fullName} onChange={handleChange} error={errors.fullName} />
                      <Field label="Phone Number *" name="phone" value={address.phone} onChange={handleChange} error={errors.phone} type="tel" />
                      <Field label="Street Address *" name="street" value={address.street} onChange={handleChange} error={errors.street} />
                      <Field label="City *" name="city" value={address.city} onChange={handleChange} error={errors.city} half />
                      <Field label="PIN Code *" name="pincode" value={address.pincode} onChange={handleChange} error={errors.pincode} half />
                      <Field label="State *" name="state" value={address.state} onChange={handleChange} error={errors.state} />
                    </div>
                  </div>

                  {/* Payment method */}
                  <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#111" }}>💳 Payment Method</h3>
                    <PayOption id="COD" selected={payMethod === "COD"} onSelect={setPayMethod} icon="💵" label="Cash on Delivery" desc="Pay when your order arrives at your door" />
                    <PayOption id="UPI" selected={payMethod === "UPI"} onSelect={setPayMethod} icon="📱" label="UPI" desc="GPay, PhonePe, Paytm & more" />
                    <PayOption id="CARD" selected={payMethod === "CARD"} onSelect={setPayMethod} icon="💳" label="Credit / Debit Card" desc="All major cards accepted" />
                  </div>
                </div>

                {/* ── RIGHT COLUMN — Order Summary ── */}
                <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", position: "sticky", top: "1rem" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#111" }}>🧾 Order Summary</h3>

                  {/* Mini item list */}
                  {cart.items.map((item) => (
                    <div key={item._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: "#374151", maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.productId?.name} × {item.quantity}
                      </span>
                      <span style={{ fontSize: 13, color: "#111", fontWeight: 500 }}>
                        ₹{((item.productId?.price || 0) * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}

                  <div style={{ height: 1, background: "#f3f4f6", margin: "14px 0" }} />

                  {[
                    { label: "Subtotal", value: `₹${subtotal.toLocaleString("en-IN")}` },
                    { label: "Delivery", value: delivery === 0 ? "FREE 🎉" : `₹${delivery}` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: "#6b7280" }}>{label}</span>
                      <span style={{ fontSize: 13, color: delivery === 0 && label === "Delivery" ? "#16a34a" : "#111", fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}

                  <div style={{ height: 1, background: "#f3f4f6", margin: "14px 0" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: 17, color: "#2563eb" }}>₹{total.toLocaleString("en-IN")}</span>
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={placing}
                    style={{
                      width: "100%", padding: "14px", background: placing ? "#93c5fd" : "#2563eb",
                      color: "#fff", border: "none", borderRadius: 10,
                      fontSize: 15, fontWeight: 700, cursor: placing ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      transition: "background 0.2s",
                    }}
                  >
                    {placing ? (
                      <>
                        <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                        Placing Order…
                      </>
                    ) : (
                      <>🔒 Place Order — ₹{total.toLocaleString("en-IN")}</>
                    )}
                  </button>

                  <p style={{ margin: "12px 0 0", fontSize: 11, color: "#9ca3af", textAlign: "center" }}>
                    🛡️ Secure checkout · Free returns · 100% genuine products
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}