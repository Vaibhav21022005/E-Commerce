import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMsg({ text: "Passwords do not match.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/auth/signup", form);
      setMsg({ text: response.data.message || "Account created! Redirecting…", type: "success" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMsg({
        text: error.response?.data?.message || "An error occurred during signup. Please try again.",
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

        .su-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0f;
          overflow: hidden;
          position: relative;
        }

        /* Animated background */
        .su-bg {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 70% 20%, rgba(212,175,55,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 10% 80%, rgba(139,90,43,0.1) 0%, transparent 50%),
            linear-gradient(135deg, #0a0a0f 0%, #12101a 50%, #0d0b12 100%);
          z-index: 0;
        }

        .su-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(212,175,55,0.03) 60px, rgba(212,175,55,0.03) 61px),
            repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(212,175,55,0.03) 60px, rgba(212,175,55,0.03) 61px);
        }

        /* Floating orbs */
        .su-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
          animation: su-float 8s ease-in-out infinite;
          pointer-events: none;
        }
        .su-orb-1 { width: 400px; height: 400px; background: rgba(212,175,55,0.08); top: -100px; right: -100px; animation-delay: 0s; }
        .su-orb-2 { width: 300px; height: 300px; background: rgba(139,90,43,0.1); bottom: -50px; left: -80px; animation-delay: -4s; }

        @keyframes su-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        /* Left panel */
        .su-left {
          display: none;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 960px) {
          .su-left {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            width: 45%;
            padding: 60px;
          }
        }

        .su-brand-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #d4af37;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .su-brand-tag::before {
          content: '';
          width: 32px;
          height: 1px;
          background: #d4af37;
        }

        .su-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 5vw, 72px);
          font-weight: 300;
          line-height: 1.1;
          color: #f5f0e8;
          margin-bottom: 24px;
        }
        .su-headline em {
          font-style: italic;
          color: #d4af37;
        }

        .su-sub {
          font-size: 14px;
          font-weight: 300;
          color: rgba(245,240,232,0.45);
          line-height: 1.8;
          max-width: 340px;
          margin-bottom: 48px;
        }

        .su-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .su-feat {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 13px;
          color: rgba(245,240,232,0.55);
          font-weight: 300;
        }
        .su-feat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d4af37;
          flex-shrink: 0;
        }

        /* Right panel / form container */
        .su-right {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 24px 16px;
        }
        @media (min-width: 960px) {
          .su-right {
            width: 55%;
            padding: 60px 80px;
          }
        }

        .su-card {
          width: 100%;
          max-width: 440px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 24px;
          padding: 44px 40px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(212,175,55,0.05),
            0 40px 80px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.06);
          animation: su-rise 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes su-rise {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Mobile brand */
        .su-mobile-brand {
          text-align: center;
          margin-bottom: 28px;
        }
        .su-mobile-brand .su-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 600;
          color: #d4af37;
          letter-spacing: 2px;
        }
        @media (min-width: 960px) { .su-mobile-brand { display: none; } }

        .su-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 400;
          color: #f5f0e8;
          margin-bottom: 6px;
          letter-spacing: 0.3px;
        }
        .su-card-sub {
          font-size: 13px;
          color: rgba(245,240,232,0.4);
          font-weight: 300;
          margin-bottom: 32px;
        }

        /* Alert */
        .su-alert {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 400;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: su-rise 0.3s ease both;
        }
        .su-alert.success {
          background: rgba(74,222,128,0.1);
          border: 1px solid rgba(74,222,128,0.25);
          color: #4ade80;
        }
        .su-alert.error {
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.25);
          color: #f87171;
        }

        /* Input group */
        .su-field {
          margin-bottom: 16px;
          position: relative;
        }
        .su-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(212,175,55,0.7);
          margin-bottom: 8px;
        }
        .su-input-wrap {
          position: relative;
        }
        .su-input {
          width: 100%;
          padding: 13px 44px 13px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,55,0.18);
          border-radius: 10px;
          color: #f5f0e8;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          outline: none;
          transition: all 0.25s ease;
        }
        .su-input::placeholder { color: rgba(245,240,232,0.25); }
        .su-input:focus {
          border-color: rgba(212,175,55,0.5);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
        }
        .su-eye {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(245,240,232,0.35);
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .su-eye:hover { color: #d4af37; }

        /* Password strength */
        .su-strength {
          margin-top: 8px;
          display: flex;
          gap: 4px;
        }
        .su-s-bar {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          background: rgba(255,255,255,0.08);
          transition: background 0.3s;
        }

        /* Divider */
        .su-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 20px 0;
        }
        .su-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .su-divider-text { font-size: 11px; color: rgba(245,240,232,0.3); letter-spacing: 1px; text-transform: uppercase; }

        /* Social buttons */
        .su-socials { display: flex; gap: 10px; margin-bottom: 20px; }
        .su-social-btn {
          flex: 1;
          padding: 11px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: rgba(245,240,232,0.6);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }
        .su-social-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
          color: #f5f0e8;
        }

        /* Submit */
        .su-btn {
          width: 100%;
          padding: 14px;
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
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          margin-top: 4px;
        }
        .su-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .su-btn:hover:not(:disabled)::after { opacity: 1; }
        .su-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(212,175,55,0.35); }
        .su-btn:active { transform: translateY(0); }
        .su-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .su-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(10,10,15,0.3);
          border-top-color: #0a0a0f;
          border-radius: 50%;
          animation: su-spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes su-spin { to { transform: rotate(360deg); } }

        /* Footer link */
        .su-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: rgba(245,240,232,0.35);
          font-weight: 300;
        }
        .su-link {
          color: #d4af37;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .su-link:hover { opacity: 0.75; }

        /* Terms */
        .su-terms {
          font-size: 11px;
          color: rgba(245,240,232,0.25);
          text-align: center;
          margin-top: 16px;
          line-height: 1.6;
        }
        .su-terms a { color: rgba(212,175,55,0.5); text-decoration: none; }
      `}</style>

      <div className="su-root">
        <div className="su-bg" />
        <div className="su-orb su-orb-1" />
        <div className="su-orb su-orb-2" />

        {/* Left Panel */}
        <div className="su-left">
          <div className="su-brand-tag">Luxe Store</div>
          <h1 className="su-headline">
            Your Style,<br /><em>Elevated.</em>
          </h1>
          <p className="su-sub">
            Join thousands of discerning shoppers who trust us for premium fashion, curated selections, and an unrivalled shopping experience.
          </p>
          <div className="su-features">
            {["Free express shipping on orders over ₹999", "Exclusive member-only deals & early access", "30-day hassle-free returns", "Secure payments & buyer protection"].map(f => (
              <div key={f} className="su-feat">
                <span className="su-feat-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="su-right">
          <div className="su-card">
            <div className="su-mobile-brand">
              <div className="su-logo-text">LUXE</div>
            </div>

            <h2 className="su-card-title">Create Account</h2>
            <p className="su-card-sub">Start your luxury shopping journey today</p>

            {msg.text && (
              <div className={`su-alert ${msg.type}`}>
                {msg.type === "success" ? "✓" : "!"} {msg.text}
              </div>
            )}

            {/* Social sign-up */}
            <div className="su-socials">
              <button className="su-social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button className="su-social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>

            <div className="su-divider">
              <span className="su-divider-line" />
              <span className="su-divider-text">or</span>
              <span className="su-divider-line" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="su-field">
                <label className="su-label">Full Name</label>
                <div className="su-input-wrap">
                  <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange}
                    className="su-input" required />
                </div>
              </div>

              <div className="su-field">
                <label className="su-label">Email Address</label>
                <div className="su-input-wrap">
                  <input name="email" type="email" placeholder="you@example.com" value={form.email}
                    onChange={handleChange} className="su-input" required />
                </div>
              </div>

              <div className="su-field">
                <label className="su-label">Password</label>
                <div className="su-input-wrap">
                  <input name="password" type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters" value={form.password}
                    onChange={handleChange} className="su-input" required />
                  <button type="button" className="su-eye" onClick={() => setShowPassword(!showPassword)}>
                    <EyeIcon show={showPassword} />
                  </button>
                </div>
                {/* Password strength bars */}
                <div className="su-strength">
                  {[1,2,3,4].map(i => {
                    const len = form.password.length;
                    const hasUpper = /[A-Z]/.test(form.password);
                    const hasNum = /\d/.test(form.password);
                    const hasSpecial = /[^A-Za-z0-9]/.test(form.password);
                    let score = 0;
                    if (len >= 6) score++;
                    if (len >= 10) score++;
                    if (hasUpper && hasNum) score++;
                    if (hasSpecial) score++;
                    const colors = ["#f87171","#fbbf24","#a3e635","#4ade80"];
                    return (
                      <div key={i} className="su-s-bar"
                        style={{ background: i <= score && form.password ? colors[score-1] : undefined }} />
                    );
                  })}
                </div>
              </div>

              <div className="su-field">
                <label className="su-label">Confirm Password</label>
                <div className="su-input-wrap">
                  <input name="confirmPassword" type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password" value={form.confirmPassword}
                    onChange={handleChange} className="su-input" required />
                  <button type="button" className="su-eye" onClick={() => setShowConfirm(!showConfirm)}>
                    <EyeIcon show={showConfirm} />
                  </button>
                </div>
              </div>

              <button type="submit" className="su-btn" disabled={loading}>
                {loading && <span className="su-spinner" />}
                {loading ? "Creating Account…" : "Create Account"}
              </button>
            </form>

            <div className="su-footer">
              Already have an account?{" "}
              <span className="su-link" onClick={() => navigate("/login")}>Login →</span>
            </div>

            <p className="su-terms">
              By creating an account you agree to our{" "}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
