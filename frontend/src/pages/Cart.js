import React, { useState } from "react";
import Navbar from "../components/Navbar";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f8f6f2;
    --surface: #ffffff;
    --border: #ede9e3;
    --accent: #f97316;
    --accent2: #fb923c;
    --red: #ef4444;
    --green: #22c55e;
    --text: #1a1a1a;
    --muted: #8a8a8a;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  .cart-page {
    max-width: 1160px; margin: 0 auto;
    padding: 40px 24px;
    display: grid; grid-template-columns: 1fr 360px; gap: 28px;
    align-items: start;
  }

  /* PAGE TITLE */
  .cart-title-row {
    display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px;
  }
  .cart-title {
    font-family: var(--font-head); font-size: 30px; font-weight: 800; letter-spacing: -0.8px;
  }
  .cart-count {
    font-size: 14px; color: var(--muted); font-weight: 500;
  }

  /* CART ITEM CARD */
  .cart-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 18px; padding: 20px;
    display: flex; gap: 20px; align-items: flex-start;
    margin-bottom: 16px;
    transition: box-shadow 0.2s, transform 0.2s;
    animation: fadeUp 0.3s ease both;
  }
  .cart-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.07); transform: translateY(-1px); }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  .cart-img {
    width: 100px; height: 100px; border-radius: 12px; object-fit: cover;
    border: 1px solid var(--border); flex-shrink: 0;
  }
  .cart-img-placeholder {
    width: 100px; height: 100px; border-radius: 12px;
    background: var(--bg); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; flex-shrink: 0;
  }

  .cart-details { flex: 1; }
  .cart-item-name {
    font-family: var(--font-head); font-size: 16px; font-weight: 700;
    margin-bottom: 4px;
  }
  .cart-item-desc { font-size: 13px; color: var(--muted); margin-bottom: 12px; line-height: 1.5; }

  .cart-bottom-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .cart-item-price { font-family: var(--font-head); font-size: 20px; font-weight: 800; color: var(--accent); }
  .cart-item-subtotal { font-size: 12px; color: var(--muted); margin-top: 2px; }

  /* QTY CONTROLS */
  .qty-controls {
    display: flex; align-items: center; gap: 0;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 50px; overflow: hidden;
  }
  .qty-btn {
    width: 36px; height: 36px; border: none; background: none;
    cursor: pointer; font-size: 18px; font-weight: 700; color: var(--text);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s, color 0.15s;
  }
  .qty-btn:hover { background: var(--accent); color: white; }
  .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .qty-val {
    min-width: 36px; text-align: center; font-weight: 700;
    font-size: 15px; font-family: var(--font-head);
  }

  /* REMOVE BTN */
  .remove-btn {
    background: none; border: none; cursor: pointer;
    color: var(--muted); font-size: 13px; font-weight: 500;
    display: flex; align-items: center; gap: 5px;
    padding: 5px 10px; border-radius: 8px; transition: all 0.15s;
  }
  .remove-btn:hover { background: rgba(239,68,68,0.08); color: var(--red); }

  /* EMPTY CART */
  .cart-empty {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 80px 40px; text-align: center;
  }
  .cart-empty-icon { font-size: 64px; margin-bottom: 20px; }
  .cart-empty h2 { font-family: var(--font-head); font-size: 22px; font-weight: 800; margin-bottom: 8px; }
  .cart-empty p { color: var(--muted); font-size: 14px; margin-bottom: 24px; }
  .shop-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent); color: white; border: none; border-radius: 50px;
    padding: 12px 28px; font-family: var(--font-head); font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all 0.15s;
  }
  .shop-btn:hover { background: var(--accent2); transform: translateY(-1px); }

  /* ORDER SUMMARY */
  .summary-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 28px;
    position: sticky; top: 24px;
  }
  .summary-title {
    font-family: var(--font-head); font-size: 20px; font-weight: 800;
    margin-bottom: 24px; letter-spacing: -0.3px;
  }

  .summary-items { margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px; }
  .summary-item { display: flex; justify-content: space-between; align-items: center; font-size: 14px; }
  .summary-item-name { color: var(--muted); max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .summary-item-price { font-weight: 600; }

  .summary-divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }

  .summary-row { display: flex; justify-content: space-between; align-items: center; font-size: 14px; margin-bottom: 10px; }
  .summary-row span:first-child { color: var(--muted); }
  .summary-row span:last-child { font-weight: 600; }

  .free-delivery { color: var(--green) !important; font-weight: 600 !important; }

  .summary-total {
    display: flex; justify-content: space-between; align-items: center;
    margin: 16px 0 24px; padding-top: 16px; border-top: 2px solid var(--border);
  }
  .summary-total-label { font-family: var(--font-head); font-size: 16px; font-weight: 700; }
  .summary-total-price { font-family: var(--font-head); font-size: 24px; font-weight: 800; color: var(--accent); }

  .checkout-btn {
    width: 100%; padding: 15px; border: none; border-radius: 14px;
    background: var(--accent); color: white; cursor: pointer;
    font-family: var(--font-head); font-size: 16px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: all 0.15s; letter-spacing: 0.2px;
  }
  .checkout-btn:hover:not(:disabled) { background: var(--accent2); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(249,115,22,0.3); }
  .checkout-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .savings-badge {
    background: rgba(34,197,94,0.1); color: var(--green);
    border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600;
    text-align: center; margin-top: 14px;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }

  /* PROMO */
  .promo-row { display: flex; gap: 8px; margin-bottom: 20px; }
  .promo-input {
    flex: 1; background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 14px; color: var(--text);
    font-family: var(--font-body); font-size: 14px; outline: none;
    transition: border-color 0.15s;
  }
  .promo-input:focus { border-color: var(--accent); }
  .promo-input::placeholder { color: var(--muted); }
  .promo-btn {
    padding: 10px 16px; border-radius: 10px; border: 1px solid var(--border);
    background: var(--surface); cursor: pointer; font-family: var(--font-body);
    font-size: 13px; font-weight: 600; color: var(--text); transition: all 0.15s;
  }
  .promo-btn:hover { border-color: var(--accent); color: var(--accent); }
  .promo-success { font-size: 12px; color: var(--green); margin-top: -12px; margin-bottom: 8px; }
  .promo-error { font-size: 12px; color: var(--red); margin-top: -12px; margin-bottom: 8px; }

  /* TOAST */
  .cart-toasts { position: fixed; top: 24px; right: 24px; z-index: 999; display: flex; flex-direction: column; gap: 10px; }
  .cart-toast {
    background: white; border: 1px solid var(--border);
    border-radius: 12px; padding: 14px 20px; font-size: 14px; font-weight: 500;
    display: flex; align-items: center; gap: 10px; min-width: 220px;
    animation: slideIn 0.3s ease; box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  }
  .cart-toast.success { border-left: 3px solid var(--green); }
  .cart-toast.info    { border-left: 3px solid var(--accent); }
  @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  @media (max-width: 900px) {
    .cart-page { grid-template-columns: 1fr; }
    .summary-card { position: static; }
  }
`;

const PROMO_CODES = { "SAVE10": 10, "RETAIL20": 20, "FIRST50": 50 };
const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_FEE = 99;

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Wireless Headphones", price: 2999, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" },
    { id: 2, name: "Smart Watch", price: 4999, quantity: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" },
  ]);
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMsg, setPromoMsg] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const increaseQty = (id) => {
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decreaseQty = (id) => {
    setCartItems(cartItems.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
  };

  const removeItem = (id) => {
    const item = cartItems.find(i => i.id === id);
    setCartItems(cartItems.filter(i => i.id !== id));
    showToast(`${item.name} removed`, "info");
  };

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, discount: PROMO_CODES[code] });
      setPromoMsg({ type: "success", text: `✅ "${code}" applied — ${PROMO_CODES[code]}% off!` });
    } else {
      setAppliedPromo(null);
      setPromoMsg({ type: "error", text: "❌ Invalid promo code" });
    }
  };

  const subtotal    = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const discount    = appliedPromo ? Math.round(subtotal * appliedPromo.discount / 100) : 0;
  const delivery    = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total       = subtotal - discount + delivery;

  return (
    <>
      <style>{styles}</style>

      {/* TOASTS */}
      <div className="cart-toasts">
        {toasts.map(t => (
          <div key={t.id} className={`cart-toast ${t.type}`}>
            <span>🛒</span> {t.message}
          </div>
        ))}
      </div>

      <Navbar />

      <div className="cart-page">
        {/* LEFT — CART ITEMS */}
        <div className="cart-left">
          <div className="cart-title-row">
            <h1 className="cart-title">Shopping Cart</h1>
            <span className="cart-count">{cartItems.length} {cartItems.length === 1 ? "item" : "items"}</span>
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added anything yet.</p>
              <button className="shop-btn" onClick={() => window.history.back()}>
                ← Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div className="cart-card" key={item.id} style={{ animationDelay: `${idx * 0.07}s` }}>
                {item.image
                  ? <img src={item.image} alt={item.name} className="cart-img" onError={e => e.target.style.display = "none"} />
                  : <div className="cart-img-placeholder">📦</div>
                }
                <div className="cart-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-desc">Premium quality product with fast delivery.</div>
                  <div className="cart-bottom-row">
                    <div>
                      <div className="cart-item-price">₹{item.price.toLocaleString()}</div>
                      {item.quantity > 1 && (
                        <div className="cart-item-subtotal">
                          Subtotal: ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="qty-controls">
                        <button className="qty-btn" onClick={() => decreaseQty(item.id)} disabled={item.quantity === 1}>−</button>
                        <span className="qty-val">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => increaseQty(item.id)}>+</button>
                      </div>
                      <button className="remove-btn" onClick={() => removeItem(item.id)}>🗑 Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div className="cart-right">
          <div className="summary-card">
            <div className="summary-title">Order Summary</div>

            {/* ITEM BREAKDOWN */}
            <div className="summary-items">
              {cartItems.map(item => (
                <div className="summary-item" key={item.id}>
                  <span className="summary-item-name">{item.name} × {item.quantity}</span>
                  <span className="summary-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <hr className="summary-divider" />

            {/* PROMO CODE */}
            <div className="promo-row">
              <input
                className="promo-input"
                placeholder="Promo code"
                value={promo}
                onChange={e => { setPromo(e.target.value); setPromoMsg(null); }}
                onKeyDown={e => e.key === "Enter" && applyPromo()}
              />
              <button className="promo-btn" onClick={applyPromo}>Apply</button>
            </div>
            {promoMsg && (
              <div className={promoMsg.type === "success" ? "promo-success" : "promo-error"}>
                {promoMsg.text}
              </div>
            )}

            <hr className="summary-divider" />

            {/* ROWS */}
            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row">
                <span>Discount ({appliedPromo.code})</span>
                <span style={{ color: "var(--green)", fontWeight: 700 }}>−₹{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Delivery</span>
              <span className={delivery === 0 ? "free-delivery" : ""}>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
            </div>
            {subtotal < FREE_DELIVERY_THRESHOLD && (
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
                Add ₹{(FREE_DELIVERY_THRESHOLD - subtotal).toLocaleString()} more for free delivery
              </div>
            )}

            {/* TOTAL */}
            <div className="summary-total">
              <span className="summary-total-label">Total</span>
              <span className="summary-total-price">₹{total.toLocaleString()}</span>
            </div>

            <button className="checkout-btn" disabled={cartItems.length === 0}>
              Proceed to Checkout →
            </button>

            {discount > 0 && (
              <div className="savings-badge">
                🎉 You're saving ₹{discount.toLocaleString()} on this order!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}