import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f0f13;
    --surface: #17171e;
    --surface2: #1e1e28;
    --border: #2a2a38;
    --accent: #f97316;
    --red: #ef4444;
    --text: #f1f1f3;
    --muted: #7c7c8a;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  .al-root {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    font-family: var(--font-body);
    color: var(--text);
  }

  /* LEFT PANEL */
  .al-left {
    flex: 1;
    background: linear-gradient(135deg, #1a0f05 0%, #0f0f13 60%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 80px;
    position: relative;
    overflow: hidden;
  }
  .al-left::before {
    content: '';
    position: absolute;
    top: -100px; left: -100px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%);
    border-radius: 50%;
  }
  .al-left::after {
    content: '';
    position: absolute;
    bottom: -80px; right: -80px;
    width: 350px; height: 350px;
    background: radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%);
    border-radius: 50%;
  }
  .al-brand {
    font-family: var(--font-head);
    font-size: 18px;
    font-weight: 800;
    color: var(--accent);
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 64px;
    position: relative; z-index: 1;
  }
  .al-headline {
    font-family: var(--font-head);
    font-size: 48px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -1.5px;
    position: relative; z-index: 1;
    margin-bottom: 20px;
  }
  .al-headline span { color: var(--accent); }
  .al-subtext {
    font-size: 15px;
    color: var(--muted);
    line-height: 1.7;
    max-width: 340px;
    position: relative; z-index: 1;
  }
  .al-features {
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative; z-index: 1;
  }
  .al-feature {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: var(--muted);
  }
  .al-feature-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
  }

  /* RIGHT PANEL */
  .al-right {
    width: 480px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 56px;
    background: var(--surface);
    border-left: 1px solid var(--border);
  }
  .al-form-wrap { width: 100%; }
  .al-form-title {
    font-family: var(--font-head);
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }
  .al-form-sub { font-size: 14px; color: var(--muted); margin-bottom: 36px; }

  .al-group { display: flex; flex-direction: column; gap: 7px; margin-bottom: 18px; }
  .al-label { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.6px; }
  .al-input-wrap { position: relative; }
  .al-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    font-size: 16px; pointer-events: none;
  }
  .al-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 11px;
    padding: 13px 14px 13px 42px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .al-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(249,115,22,0.12); }
  .al-input::placeholder { color: var(--muted); }
  .al-input.error { border-color: var(--red); }
  .al-error { font-size: 12px; color: var(--red); margin-top: 2px; }

  .al-toggle-pass {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; font-size: 16px; color: var(--muted);
    transition: color 0.15s;
  }
  .al-toggle-pass:hover { color: var(--text); }

  .al-submit {
    width: 100%; padding: 14px;
    background: var(--accent); color: white;
    border: none; border-radius: 11px;
    font-family: var(--font-head); font-size: 15px; font-weight: 700;
    cursor: pointer; margin-top: 8px;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: all 0.15s ease;
    letter-spacing: 0.3px;
  }
  .al-submit:hover:not(:disabled) { background: #fb923c; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(249,115,22,0.3); }
  .al-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .al-error-banner {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    color: var(--red);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: shake 0.4s ease;
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
  }

  .al-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .al-left { display: none; }
    .al-right { width: 100%; padding: 40px 28px; }
  }
`;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error on type
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    if (loginError) setLoginError("");
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Enter a valid email";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 4) errs.password = "Password too short";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const login = async () => {
    if (!validate()) return;
    setLoading(true);
    setLoginError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/admin");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password. Please try again.";
      setLoginError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="al-root">

        {/* LEFT PANEL */}
        <div className="al-left">
          <div className="al-brand">
            <span>🛍️</span> RetailShop
          </div>
          <div className="al-headline">
            Welcome<br />back, <span>Admin</span>
          </div>
          <p className="al-subtext">
            Manage your products, track orders, and grow your retail business — all in one place.
          </p>
          <div className="al-features">
            {["Manage products & inventory", "Track orders in real time", "View customer insights", "Monitor revenue & analytics"].map(f => (
              <div className="al-feature" key={f}>
                <div className="al-feature-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="al-right">
          <div className="al-form-wrap">
            <div className="al-form-title">Admin Login</div>
            <div className="al-form-sub">Sign in to access your dashboard</div>

            {/* ERROR BANNER */}
            {loginError && (
              <div className="al-error-banner">
                <span>⚠️</span> {loginError}
              </div>
            )}

            {/* EMAIL */}
            <div className="al-group">
              <label className="al-label">Email Address</label>
              <div className="al-input-wrap">
                <span className="al-input-icon">📧</span>
                <input
                  className={`al-input ${errors.email ? "error" : ""}`}
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="al-error">⚠ {errors.email}</span>}
            </div>

            {/* PASSWORD */}
            <div className="al-group">
              <label className="al-label">Password</label>
              <div className="al-input-wrap">
                <span className="al-input-icon">🔒</span>
                <input
                  className={`al-input ${errors.password ? "error" : ""}`}
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                />
                <button
                  className="al-toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                  type="button"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <span className="al-error">⚠ {errors.password}</span>}
            </div>

            {/* SUBMIT */}
            <button className="al-submit" onClick={login} disabled={loading}>
              {loading ? (
                <><div className="al-spinner" /> Signing in...</>
              ) : (
                <>Login to Dashboard →</>
              )}
            </button>
          </div>
        </div>

      </div>
    </>
  );
}