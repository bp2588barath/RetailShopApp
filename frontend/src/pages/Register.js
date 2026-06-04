import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", password: "", confirmPassword: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1); // 1 = personal info, 2 = security

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    if (apiError) setApiError("");
  };

  function validateStep1() {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Enter your full name (min 2 chars)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit phone number";
    if (!form.address.trim()) e.address = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e = {};
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (!/[A-Z]/.test(form.password)) e.password = "Must contain at least one uppercase letter";
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleNext = (ev) => {
    ev.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const handleRegister = async (ev) => {
    ev.preventDefault();
    if (!validateStep2()) return;
    try {
      setLoading(true);
      const { confirmPassword, ...payload } = form;
      await API.post("/auth/register", payload);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* password strength */
  function passwordStrength(pw) {
    if (!pw) return { label: "", pct: 0, color: "#e5e7eb" };
    let score = 0;
    if (pw.length >= 6)  score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: "Weak",   pct: 20, color: "#ef4444" };
    if (score <= 2) return { label: "Fair",   pct: 45, color: "#f59e0b" };
    if (score <= 3) return { label: "Good",   pct: 70, color: "#3b82f6" };
    return                { label: "Strong", pct: 100, color: "#10b981" };
  }
  const strength = passwordStrength(form.password);

  const inputStyle = (field) => ({
    width: "100%", padding: "12px 14px", fontSize: 14, boxSizing: "border-box",
    border: `1.5px solid ${errors[field] ? "#ef4444" : "#e5e7eb"}`,
    borderRadius: 10, outline: "none", background: "#f9fafb",
    color: "#111", fontFamily: "inherit", transition: "border 0.2s, background 0.2s",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        .inp:focus { border-color:#2563eb !important; background:#fff !important; }
        .reg-btn:hover:not(:disabled) { background:#1d4ed8 !important; }
        .back-btn:hover { background:#f3f4f6 !important; }
        .text-link:hover { text-decoration:underline; }
      `}</style>

      {/* ══ LEFT PANEL ══ */}
      <div style={{
        flex: 1, background: "linear-gradient(145deg,#064e3b 0%,#059669 55%,#10b981 100%)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", padding: "3rem 2rem", position: "relative", overflow: "hidden",
      }}>
        {[
          { size: 280, top: -70, left: -70, opacity: 0.07 },
          { size: 180, bottom: -50, right: -50, opacity: 0.07 },
          { size: 100, top: "45%", left: "15%", opacity: 0.05 },
        ].map((c, i) => (
          <div key={i} style={{
            position: "absolute", width: c.size, height: c.size, borderRadius: "50%",
            background: "#fff", opacity: c.opacity,
            top: c.top, left: c.left, right: c.right, bottom: c.bottom,
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 320 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🛍️</div>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: "0 0 10px" }}>Join RetailShop</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.7, margin: "0 0 2rem" }}>
            Create your free account and start shopping thousands of premium products today.
          </p>

          {["🎁 Exclusive member discounts", "🚀 Faster checkout every time", "📦 Track all your orders easily", "💬 Priority customer support"].map(f => (
            <div key={f} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,0.15)", borderRadius: 100,
              padding: "9px 16px", marginBottom: 8, fontSize: 13,
              color: "rgba(255,255,255,0.95)",
            }}>
              {f}
            </div>
          ))}

          {/* Step indicator on left panel */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: "2rem" }}>
            {[1, 2].map(s => (
              <React.Fragment key={s}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: step >= s ? "#fff" : "rgba(255,255,255,0.3)",
                  color: step >= s ? "#059669" : "rgba(255,255,255,0.6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, transition: "all 0.3s",
                }}>
                  {step > s ? "✓" : s}
                </div>
                {s < 2 && <div style={{ width: 40, height: 2, background: step > 1 ? "#fff" : "rgba(255,255,255,0.3)", transition: "background 0.3s" }} />}
              </React.Fragment>
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 8 }}>
            Step {step} of 2 — {step === 1 ? "Personal Info" : "Set Password"}
          </p>
        </div>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div style={{
        width: "min(500px,100%)", display: "flex", alignItems: "center",
        justifyContent: "center", padding: "2rem", background: "#fff", overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 400, animation: "fadeUp 0.4s ease" }}>

          {/* Header */}
          <div style={{ marginBottom: "1.75rem" }}>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#6b7280", fontWeight: 600, letterSpacing: "0.06em" }}>
              {step === 1 ? "STEP 1 OF 2" : "STEP 2 OF 2"}
            </p>
            <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: "#111" }}>
              {step === 1 ? "Create your account" : "Secure your account"}
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
              Already have an account?{" "}
              <Link to="/login" className="text-link" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </div>

          {/* API Error */}
          {apiError && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10,
              padding: "12px 14px", marginBottom: "1.25rem",
              display: "flex", alignItems: "flex-start", gap: 10,
              animation: "shake 0.4s ease",
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
              <p style={{ margin: 0, fontSize: 13, color: "#b91c1c", lineHeight: 1.5 }}>{apiError}</p>
            </div>
          )}

          {/* ── STEP 1: Personal Info ── */}
          {step === 1 && (
            <form onSubmit={handleNext} style={{ display: "flex", flexDirection: "column", gap: "1rem", animation: "slideIn 0.3s ease" }}>

              {[
                { label: "Full Name",     name: "name",    placeholder: "John Doe",               type: "text" },
                { label: "Email Address", name: "email",   placeholder: "you@example.com",        type: "email" },
                { label: "Phone Number",  name: "phone",   placeholder: "10-digit mobile number", type: "tel" },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{f.label} *</label>
                  <input
                    className="inp"
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    placeholder={f.placeholder}
                    onChange={handleChange}
                    style={inputStyle(f.name)}
                  />
                  {errors[f.name] && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>⚠ {errors[f.name]}</p>}
                </div>
              ))}

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Delivery Address *</label>
                <textarea
                  className="inp"
                  name="address"
                  value={form.address}
                  placeholder="House no, Street, City, State, PIN"
                  onChange={handleChange}
                  rows={3}
                  style={{ ...inputStyle("address"), resize: "none", lineHeight: 1.6 }}
                />
                {errors.address && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>⚠ {errors.address}</p>}
              </div>

              <button type="submit" className="reg-btn" style={{
                width: "100%", padding: "13px", background: "#2563eb", color: "#fff",
                border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
                cursor: "pointer", transition: "background 0.2s", marginTop: 4,
              }}>
                Continue →
              </button>
            </form>
          )}

          {/* ── STEP 2: Password ── */}
          {step === 2 && (
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem", animation: "slideIn 0.3s ease" }}>

              {/* Password */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password *</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="inp"
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={form.password}
                    placeholder="Min 6 chars, include uppercase"
                    onChange={handleChange}
                    style={{ ...inputStyle("password"), paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", fontSize: 17, color: "#6b7280",
                  }}>{showPass ? "🙈" : "👁️"}</button>
                </div>
                {/* Strength meter */}
                {form.password && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 4, background: "#e5e7eb", borderRadius: 100, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${strength.pct}%`, background: strength.color, borderRadius: 100, transition: "all 0.3s" }} />
                    </div>
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: strength.color, fontWeight: 600 }}>{strength.label} password</p>
                  </div>
                )}
                {errors.password && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>⚠ {errors.password}</p>}
              </div>

              {/* Confirm password */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Confirm Password *</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="inp"
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    placeholder="Re-enter your password"
                    onChange={handleChange}
                    style={{ ...inputStyle("confirmPassword"), paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowConfirm(s => !s)} style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", fontSize: 17, color: "#6b7280",
                  }}>{showConfirm ? "🙈" : "👁️"}</button>
                </div>
                {/* Match indicator */}
                {form.confirmPassword && (
                  <p style={{ margin: "4px 0 0", fontSize: 11, fontWeight: 600, color: form.confirmPassword === form.password ? "#10b981" : "#ef4444" }}>
                    {form.confirmPassword === form.password ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
                {errors.confirmPassword && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>⚠ {errors.confirmPassword}</p>}
              </div>

              {/* Password tips */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "#15803d" }}>Password must include:</p>
                {[
                  { rule: form.password.length >= 6,         text: "At least 6 characters" },
                  { rule: /[A-Z]/.test(form.password),       text: "One uppercase letter" },
                  { rule: /[0-9]/.test(form.password),       text: "One number (recommended)" },
                ].map(r => (
                  <p key={r.text} style={{ margin: "3px 0 0", fontSize: 12, color: r.rule ? "#15803d" : "#6b7280", display: "flex", alignItems: "center", gap: 6 }}>
                    {r.rule ? "✓" : "○"} {r.text}
                  </p>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10, marginTop: 4 }}>
                <button type="button" className="back-btn" onClick={() => setStep(1)} style={{
                  padding: "13px", background: "#f9fafb", color: "#374151",
                  border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14,
                  fontWeight: 600, cursor: "pointer", transition: "background 0.2s",
                }}>
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="reg-btn" style={{
                  padding: "13px", background: loading ? "#86efac" : "#059669",
                  color: "#fff", border: "none", borderRadius: 10, fontSize: 15,
                  fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  transition: "background 0.2s",
                }}>
                  {loading ? (
                    <>
                      <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Creating account…
                    </>
                  ) : "Create Account 🎉"}
                </button>
              </div>

              <p style={{ margin: "0.5rem 0 0", fontSize: 11, color: "#9ca3af", textAlign: "center", lineHeight: 1.6 }}>
                By creating an account you agree to our{" "}
                <span className="text-link" style={{ color: "#6b7280", cursor: "pointer" }}>Terms of Service</span>
                {" "}and{" "}
                <span className="text-link" style={{ color: "#6b7280", cursor: "pointer" }}>Privacy Policy</span>.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;