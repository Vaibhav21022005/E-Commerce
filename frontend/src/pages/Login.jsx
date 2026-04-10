import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", form);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      if (rememberMe) localStorage.setItem("rememberedEmail", form.email);
      setMsg({ text: "Welcome back! Redirecting…", type: "success" });
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      setMsg({
        text: error.response?.data?.message || "Invalid email or password.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ show }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {show ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lg-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0f;
          overflow: hidden;
          position: relative;
        }

        /* Animated background */
        .lg-bg {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 70% at 20% 30%, rgba(212,175,55,0.1) 0%, transparent 55%),
            radial-gradient(ellipse 80% 50% at 90% 80%, rgba(100,60,20,0.08) 0%, transparent 50%),
            linear-gradient(135deg, #0a0a0f 0%, #0f0d18 50%, #0a0a0f 100%);
          z-index: 0;
        }
        .lg-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(212,175,55,0.025) 60px, rgba(212,175,55,0.025) 61px),
            repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(212,175,55,0.025) 60px, rgba(212,175,55,0.025) 61px);
        }

        .lg-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          z-index: 0;
          pointer-events: none;
          animation: lg-pulse 10s ease-in-out infinite;
        }
        .lg-orb-1 { width: 500px; height: 500px; background: rgba(212,175,55,0.07); top: -150px; left: -100px; animation-delay: 0s; }
        .lg-orb-2 { width: 350px; height: 350px; background: rgba(139,90,43,0.09); bottom: -80px; right: -80px; animation-delay: -5s; }

        @keyframes lg-pulse {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.8; }
          50% { transform: scale(1.1) translateY(-20px); opacity: 1; }
        }

        /* Layout */
        .lg-wrapper {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: stretch;
          width: 100%;
          min-height: 100vh;
        }

        /* Decorative right panel */
        .lg-deco {
          display: none;
        }
        @media (min-width: 960px) {
          .lg-deco {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            width: 45%;
            position: relative;
            padding: 60px;
            overflow: hidden;
          }
          .lg-deco::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(160deg, rgba(212,175,55,0.05) 0%, rgba(0,0,0,0.3) 100%);
            border-left: 1px solid rgba(212,175,55,0.08);
          }
        }

        .lg-deco-pattern {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          overflow: hidden;
        }
        .lg-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(212,175,55,0.06);
        }
        .lg-c1 { width: 600px; height: 600px; top: -200px; right: -200px; }
        .lg-c2 { width: 400px; height: 400px; top: -100px; right: -100px; }
        .lg-c3 { width: 200px; height: 200px; top: 0; right: 0; }

        .lg-deco-content {
          position: relative;
          z-index: 1;
        }
        .lg-deco-tag {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(212,175,55,0.5);
          margin-bottom: 20px;
        }
        .lg-deco-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 3vw, 52px);
          font-weight: 300;
          color: #f5f0e8;
          line-height: 1.2;
          margin-bottom: 24px;
        }
        .lg-deco-quote em { font-style: italic; color: #d4af37; }
        .lg-deco-line {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, #d4af37, transparent);
          margin-bottom: 20px;
        }
        .lg-deco-text {
          font-size: 13px;
          font-weight: 300;
          color: rgba(245,240,232,0.35);
          line-height: 1.8;
          max-width: 300px;
        }

        /* Left / form side */
        .lg-left {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 24px 16px;
        }
        @media (min-width: 960px) {
          .lg-left {
            width: 55%;
            padding: 60px 80px;
            order: -1;
          }
        }

        /* Card */
        .lg-card {
          width: 100%;
          max-width: 420px;
          animation: lg-rise 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes lg-rise {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Logo */
        .lg-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }
        .lg-logo-mark {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #d4af37, #b8962e);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 600;
          color: #0a0a0f;
        }
        .lg-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: #f5f0e8;
          letter-spacing: 2px;
        }

        .lg-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 400;
          color: #f5f0e8;
          margin-bottom: 6px;
          letter-spacing: 0.3px;
        }
        .lg-sub {
          font-size: 13px;
          color: rgba(245,240,232,0.38);
          font-weight: 300;
          margin-bottom: 36px;
        }

        /* Alert */
        .lg-alert {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: lg-rise 0.3s ease both;
        }
        .lg-alert.success { background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.25); color: #4ade80; }
        .lg-alert.error   { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); color: #f87171; }

        /* Fields */
        .lg-field { margin-bottom: 18px; }
        .lg-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(212,175,55,0.7);
          margin-bottom: 8px;
        }
        .lg-input-wrap { position: relative; }
        .lg-input {
          width: 100%;
          padding: 14px 46px 14px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 10px;
          color: #f5f0e8;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          outline: none;
          transition: all 0.25s ease;
        }
        .lg-input::placeholder { color: rgba(245,240,232,0.22); }
        .lg-input:focus {
          border-color: rgba(212,175,55,0.45);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.07);
        }
        .lg-eye {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(245,240,232,0.3);
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .lg-eye:hover { color: #d4af37; }

        /* Row */
        .lg-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          margin-top: 4px;
        }
        .lg-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 13px;
          color: rgba(245,240,232,0.45);
          font-weight: 300;
          user-select: none;
        }
        .lg-checkbox {
          width: 16px;
          height: 16px;
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 4px;
          background: rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .lg-checkbox.checked {
          background: #d4af37;
          border-color: #d4af37;
        }
        .lg-checkbox.checked::after {
          content: '✓';
          font-size: 10px;
          color: #0a0a0f;
          font-weight: bold;
        }
        .lg-forgot {
          font-size: 12px;
          color: rgba(212,175,55,0.6);
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s;
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
        }
        .lg-forgot:hover { color: #d4af37; }

        /* Divider */
        .lg-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 20px 0;
        }
        .lg-div-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
        .lg-div-text { font-size: 11px; color: rgba(245,240,232,0.28); letter-spacing: 1px; text-transform: uppercase; }

        /* Social */
        .lg-socials { display: flex; gap: 10px; margin-bottom: 8px; }
        .lg-social {
          flex: 1;
          padding: 11px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          color: rgba(245,240,232,0.55);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .lg-social:hover { background: rgba(255,255,255,0.07); color: #f5f0e8; border-color: rgba(255,255,255,0.12); }

        /* Submit */
        .lg-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%);
          border: none;
          border-radius: 10px;
          color: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }
        .lg-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0);
          transition: background 0.25s;
        }
        .lg-btn:hover:not(:disabled)::after { background: rgba(255,255,255,0.12); }
        .lg-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(212,175,55,0.32); }
        .lg-btn:active { transform: translateY(0); }
        .lg-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .lg-spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(10,10,15,0.25);
          border-top-color: #0a0a0f;
          border-radius: 50%;
          animation: lg-spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes lg-spin { to { transform: rotate(360deg); } }

        /* Footer */
        .lg-footer {
          text-align: center;
          margin-top: 28px;
          font-size: 13px;
          color: rgba(245,240,232,0.32);
          font-weight: 300;
        }
        .lg-link {
          color: #d4af37;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .lg-link:hover { opacity: 0.75; }

        /* Trust badges */
        .lg-trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .lg-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(245,240,232,0.2);
          font-weight: 300;
        }
      `}</style>

      <div className="lg-root">
        <div className="lg-bg" />
        <div className="lg-orb lg-orb-1" />
        <div className="lg-orb lg-orb-2" />

        <div className="lg-wrapper">
          {/* Form side */}
          <div className="lg-left">
            <div className="lg-card">
              <div className="lg-logo">
                <div className="lg-logo-mark">L</div>
                <div className="lg-logo-text">LUXE</div>
              </div>

              <h1 className="lg-title">Welcome Back</h1>
              <p className="lg-sub">Sign in to access your account & exclusive deals</p>

              {msg.text && (
                <div className={`lg-alert ${msg.type}`}>
                  {msg.type === "success" ? "✓" : "!"} {msg.text}
                </div>
              )}

              {/* Social login */}
              <div className="lg-socials">
                <button className="lg-social">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button className="lg-social">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
              </div>

              <div className="lg-divider">
                <span className="lg-div-line" />
                <span className="lg-div-text">or sign in with email</span>
                <span className="lg-div-line" />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="lg-field">
                  <label className="lg-label">Email Address</label>
                  <div className="lg-input-wrap">
                    <input name="email" type="email" placeholder="you@example.com"
                      value={form.email} onChange={handleChange} className="lg-input" required />
                  </div>
                </div>

                <div className="lg-field">
                  <label className="lg-label">Password</label>
                  <div className="lg-input-wrap">
                    <input name="password" type={showPassword ? "text" : "password"}
                      placeholder="Enter your password" value={form.password}
                      onChange={handleChange} className="lg-input" required />
                    <button type="button" className="lg-eye" onClick={() => setShowPassword(!showPassword)}>
                      <EyeIcon show={showPassword} />
                    </button>
                  </div>
                </div>

                <div className="lg-row">
                  <div className="lg-remember" onClick={() => setRememberMe(!rememberMe)}>
                    <div className={`lg-checkbox ${rememberMe ? "checked" : ""}`} />
                    Remember me
                  </div>
                  <button type="button" className="lg-forgot">Forgot password?</button>
                </div>

                <button type="submit" className="lg-btn" disabled={loading}>
                  {loading && <span className="lg-spinner" />}
                  {loading ? "Signing In…" : "Login"}
                </button>
              </form>

              <div className="lg-footer">
                New to Luxe?{" "}
                <span className="lg-link" onClick={() => navigate("/signup")}>Create an account →</span>
              </div>

              <div className="lg-trust">
                <div className="lg-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  SSL Secured
                </div>
                <div className="lg-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Protected
                </div>
                <div className="lg-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  24/7 Support
                </div>
              </div>
            </div>
          </div>

          {/* Decorative panel */}
          <div className="lg-deco">
            <div className="lg-deco-pattern">
              <div className="lg-circle lg-c1" />
              <div className="lg-circle lg-c2" />
              <div className="lg-circle lg-c3" />
            </div>
            <div className="lg-deco-content">
              <div className="lg-deco-tag">Member Benefits</div>
              <div className="lg-deco-quote">
                Shop the world's finest <em>collections</em>, delivered to you.
              </div>
              <div className="lg-deco-line" />
              <div className="lg-deco-text">
                Exclusive access to new arrivals, member pricing, and premium customer service — all in one place.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
