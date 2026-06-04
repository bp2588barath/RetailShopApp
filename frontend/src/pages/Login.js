import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    if (apiError) setApiError("");
  };

  function validate() {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await API.post("/auth/login", formData);
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("token", res.data.token);
      storage.setItem("userId", res.data.user._id);
      storage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── shared input style ── */
  const inputStyle = (field) => ({
    width: "100%", padding: "12px 14px", fontSize: 14, boxSizing: "border-box",
    border: `1.5px solid ${errors[field] ? "#ef4444" : "#e5e7eb"}`,
    borderRadius: 10, outline: "none", background: "#f9fafb",
    color: "#111", fontFamily: "inherit", transition: "border 0.2s, background 0.2s",
  });

  return (
    <div style={{
      display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shake  { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        @keyframes spin   { to { transform:rotate(360deg); } }
        .inp:focus { border-color:#2563eb !important; background:#fff !important; }
        .login-btn:hover:not(:disabled) { background:#1d4ed8 !important; }
        .social-btn:hover { background:#f3f4f6 !important; }
        .text-link:hover { text-decoration:underline; }
      `}</style>

      {/* ══ LEFT PANEL ══ */}
      <div style={{
        flex: 1, background: "linear-gradient(145deg,#1e3a5f 0%,#2563eb 60%,#7c3aed 100%)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", padding: "3rem 2rem", position: "relative", overflow: "hidden",
      }}>
        {/* decorative circles */}
        {[
          { size: 300, top: -80,  left: -80,  opacity: 0.07 },
          { size: 200, bottom: -60, right: -60, opacity: 0.07 },
          { size: 120, top: "40%", left: "10%", opacity: 0.05 },
        ].map((c, i) => (
          <div key={i} style={{
            position: "absolute", width: c.size, height: c.size, borderRadius: "50%",
            background: "#fff", opacity: c.opacity,
            top: c.top, left: c.left, right: c.right, bottom: c.bottom,
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 320 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🛍️</div>
          <h1 style={{ color: "#fff", fontSize: 30, fontWeight: 800, margin: "0 0 12px" }}>
            RetailShop
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.7, margin: "0 0 2.5rem" }}>
            Discover premium products, track orders, and enjoy a seamless shopping experience.
          </p>

          {/* Feature pills */}
          {["🚚 Free delivery on orders ₹499+", "🔒 Secure & encrypted checkout", "🔄 Easy 30-day returns"].map(f => (
            <div key={f} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,0.12)", borderRadius: 100,
              padding: "10px 18px", marginBottom: 10, fontSize: 13,
              color: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)",
            }}>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div style={{
        width: "min(480px, 100%)", display: "flex", alignItems: "center",
        justifyContent: "center", padding: "2rem", background: "#fff",
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 380, animation: "fadeUp 0.4s ease" }}>

          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#6b7280", fontWeight: 600, letterSpacing: "0.06em" }}>
              WELCOME BACK
            </p>
            <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 800, color: "#111" }}>
              Sign in to your account
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
              Don't have an account?{" "}
              <Link to="/register" className="text-link" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
                Create one free
              </Link>
            </p>
          </div>

          {/* API Error banner */}
          {apiError && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10,
              padding: "12px 14px", marginBottom: "1.25rem", display: "flex",
              alignItems: "flex-start", gap: 10, animation: "shake 0.4s ease",
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
              <p style={{ margin: 0, fontSize: 13, color: "#b91c1c", lineHeight: 1.5 }}>{apiError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                className="inp"
                type="email"
                name="email"
                value={formData.email}
                placeholder="you@example.com"
                onChange={handleChange}
                style={inputStyle("email")}
                autoComplete="email"
              />
              {errors.email && (
                <p style={{ margin: "5px 0 0", fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 4 }}>
                  ⚠ {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Password</label>
                <span className="text-link" style={{ fontSize: 12, color: "#2563eb", cursor: "pointer", fontWeight: 500 }}>
                  Forgot password?
                </span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  className="inp"
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  placeholder="Enter your password"
                  onChange={handleChange}
                  style={{ ...inputStyle("password"), paddingRight: 44 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", fontSize: 17, padding: 0, color: "#6b7280",
                  }}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p style={{ margin: "5px 0 0", fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 4 }}>
                  ⚠ {errors.password}
                </p>
              )}
            </div>

            {/* Remember me */}
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#374151" }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ width: 15, height: 15, accentColor: "#2563eb" }}
              />
              Keep me signed in
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="login-btn"
              style={{
                width: "100%", padding: "13px", background: loading ? "#93c5fd" : "#2563eb",
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "background 0.2s", marginTop: 4,
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Signing in…
                </>
              ) : "Sign In →"}
            </button>

          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "1.5rem 0" }}>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            <span style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "🇬", label: "Google" },
              { icon: "📘", label: "Facebook" },
            ].map(s => (
              <button key={s.label} className="social-btn" type="button" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "11px 16px", border: "1.5px solid #e5e7eb", borderRadius: 10,
                background: "#fff", fontSize: 13, fontWeight: 600, color: "#374151",
                cursor: "pointer", transition: "background 0.2s",
              }}>
                <span style={{ fontSize: 16 }}>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>

          {/* Footer note */}
          <p style={{ margin: "1.5rem 0 0", fontSize: 11, color: "#9ca3af", textAlign: "center", lineHeight: 1.6 }}>
            By signing in you agree to our{" "}
            <span className="text-link" style={{ color: "#6b7280", cursor: "pointer" }}>Terms of Service</span>
            {" "}and{" "}
            <span className="text-link" style={{ color: "#6b7280", cursor: "pointer" }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}