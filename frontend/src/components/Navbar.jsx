import { Link, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const userId = localStorage.getItem("userId");

  // Cart count loader
  const loadCart = async () => {
    if (!userId) { setCartCount(0); return; }
    try {
      const response = await api.get(`/cart/${userId}`);
      const total = (response.data.items || []).reduce((s, i) => s + i.quantity, 0);
      setCartCount(total);
    } catch { setCartCount(0); }
  };

  useEffect(() => {
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, [userId]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = () => {
    localStorage.clear();
    setCartCount(0);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        .nb-root{
          position:sticky;top:0;z-index:100;
          font-family:'DM Sans',sans-serif;
          transition:all 0.3s ease;
        }
        .nb-root.scrolled{
          background:rgba(11,15,26,0.95);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
          border-bottom:1px solid rgba(0,212,255,0.12);
          box-shadow:0 4px 32px rgba(0,0,0,0.4);
        }
        .nb-root.top{
          background:rgba(11,15,26,0.7);
          backdrop-filter:blur(12px);
          -webkit-backdrop-filter:blur(12px);
          border-bottom:1px solid rgba(0,212,255,0.06);
        }
        .nb-inner{
          max-width:1200px;margin:0 auto;
          padding:0 24px;height:64px;
          display:flex;align-items:center;justify-content:space-between;
        }
        /* Brand */
        .nb-brand{
          display:flex;align-items:center;gap:10px;
          text-decoration:none;
        }
        .nb-logo-mark{
          width:32px;height:32px;border-radius:8px;
          background:linear-gradient(135deg,#00d4ff,#0099cc);
          display:flex;align-items:center;justify-content:center;
          font-family:'Syne',sans-serif;font-size:16px;font-weight:700;
          color:#0b0f1a;flex-shrink:0;
          box-shadow:0 0 12px rgba(0,212,255,0.3);
        }
        .nb-logo-text{
          font-family:'Syne',sans-serif;font-size:18px;font-weight:700;
          color:#fff;letter-spacing:1px;
        }
        .nb-logo-text span{color:#00d4ff;}
        /* Center links */
        .nb-links{
          display:flex;align-items:center;gap:4px;
        }
        .nb-link{
          padding:7px 16px;border-radius:8px;
          font-size:13px;font-weight:400;
          color:rgba(255,255,255,0.5);
          text-decoration:none;
          transition:all 0.2s;
          position:relative;
        }
        .nb-link:hover{color:#fff;background:rgba(255,255,255,0.05);}
        .nb-link.active{
          color:#00d4ff;
          background:rgba(0,212,255,0.08);
        }
        .nb-link.active::after{
          content:'';
          position:absolute;bottom:-1px;left:50%;transform:translateX(-50%);
          width:20px;height:2px;border-radius:2px;
          background:#00d4ff;
        }
        /* Right side */
        .nb-right{display:flex;align-items:center;gap:8px;}
        /* Cart button */
        .nb-cart{
          position:relative;
          display:flex;align-items:center;gap:8px;
          padding:8px 16px;
          border:1px solid rgba(0,212,255,0.2);
          border-radius:10px;
          background:rgba(0,212,255,0.05);
          color:#00d4ff;
          font-size:13px;font-weight:500;
          text-decoration:none;
          transition:all 0.2s;
          font-family:'DM Sans',sans-serif;
        }
        .nb-cart:hover{
          background:rgba(0,212,255,0.12);
          border-color:rgba(0,212,255,0.45);
        }
        .nb-cart-icon{
          width:16px;height:16px;display:flex;flex-direction:column;
          justify-content:center;align-items:center;gap:3px;
        }
        .nb-cart-icon svg{width:16px;height:16px;}
        .nb-cart-badge{
          position:absolute;top:-7px;right:-7px;
          width:18px;height:18px;border-radius:50%;
          background:linear-gradient(135deg,#ff5050,#cc2020);
          color:#fff;font-size:10px;font-weight:700;
          display:flex;align-items:center;justify-content:center;
          border:2px solid #0b0f1a;
          animation:nb-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes nb-pop{from{transform:scale(0)}to{transform:scale(1)}}
        /* Logout / Login */
        .nb-logout{
          padding:8px 18px;
          background:transparent;
          border:1px solid rgba(255,255,255,0.1);
          border-radius:10px;
          color:rgba(255,255,255,0.4);
          font-family:'DM Sans',sans-serif;
          font-size:13px;cursor:pointer;
          transition:all 0.2s;
        }
        .nb-logout:hover{
          border-color:rgba(255,80,80,0.4);
          color:#ff5050;
          background:rgba(255,80,80,0.06);
        }
        .nb-login{
          padding:8px 20px;
          background:linear-gradient(135deg,#00d4ff,#0099cc);
          border:none;border-radius:10px;
          color:#0b0f1a;
          font-family:'Syne',sans-serif;
          font-size:13px;font-weight:700;
          text-decoration:none;letter-spacing:0.3px;
          transition:all 0.2s;
          display:flex;align-items:center;
        }
        .nb-login:hover{
          transform:translateY(-1px);
          box-shadow:0 6px 16px rgba(0,212,255,0.35);
        }
        /* Mobile hamburger */
        .nb-ham{
          display:none;
          flex-direction:column;gap:5px;
          background:none;border:none;cursor:pointer;padding:6px;
        }
        .nb-ham span{
          display:block;width:22px;height:2px;
          background:rgba(255,255,255,0.6);
          border-radius:2px;transition:all 0.3s;
        }
        /* Mobile menu */
        .nb-mobile{
          display:none;
          flex-direction:column;
          padding:16px 24px 20px;
          border-top:1px solid rgba(0,212,255,0.08);
          background:rgba(11,15,26,0.98);
          gap:6px;
        }
        .nb-mobile.open{display:flex;}
        .nb-mobile-link{
          padding:10px 14px;border-radius:8px;
          font-size:14px;color:rgba(255,255,255,0.55);
          text-decoration:none;transition:all 0.2s;
        }
        .nb-mobile-link:hover,.nb-mobile-link.active{
          color:#00d4ff;background:rgba(0,212,255,0.08);
        }
        /* Dot */
        .nb-dot{
          width:6px;height:6px;border-radius:50%;background:#00d4ff;
          box-shadow:0 0 8px rgba(0,212,255,0.9);
          animation:nb-pulse 2s ease-in-out infinite;flex-shrink:0;
        }
        @keyframes nb-pulse{
          0%,100%{box-shadow:0 0 6px rgba(0,212,255,0.8);}
          50%{box-shadow:0 0 16px rgba(0,212,255,1);}
        }
        @media(max-width:640px){
          .nb-links{display:none;}
          .nb-ham{display:flex;}
          .nb-cart span:not(.nb-cart-badge){display:none;}
          .nb-cart{padding:8px 12px;}
        }
      `}</style>

      <nav className={`nb-root ${scrolled ? "scrolled" : "top"}`}>
        <div className="nb-inner">
          {/* Brand */}
          <Link to="/" className="nb-brand">
            <div className="nb-dot" />
            <span className="nb-logo-text">LU<span>XE</span></span>
          </Link>

          {/* Center nav */}
          <div className="nb-links">
            <Link to="/" className={`nb-link ${isActive("/") ? "active" : ""}`}>Home</Link>
            <Link to="/cart" className={`nb-link ${isActive("/cart") ? "active" : ""}`}>Cart</Link>
            {userId && (
              <Link to="/admin/products" className={`nb-link ${location.pathname.startsWith("/admin") ? "active" : ""}`}>
                Admin
              </Link>
            )}
          </div>

          {/* Right */}
          <div className="nb-right">
            <Link to="/cart" className="nb-cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span>Cart</span>
              {cartCount > 0 && <span className="nb-cart-badge">{cartCount}</span>}
            </Link>

            {userId ? (
              <button className="nb-logout" onClick={logout}>Logout</button>
            ) : (
              <Link to="/login" className="nb-login">Sign In</Link>
            )}

            {/* Mobile hamburger */}
            <button className="nb-ham" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <span style={menuOpen ? {transform:"rotate(45deg) translate(5px,5px)"} : {}} />
              <span style={menuOpen ? {opacity:0} : {}} />
              <span style={menuOpen ? {transform:"rotate(-45deg) translate(5px,-5px)"} : {}} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`nb-mobile ${menuOpen ? "open" : ""}`}>
          <Link to="/" className={`nb-mobile-link ${isActive("/") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/cart" className={`nb-mobile-link ${isActive("/cart") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
          {userId && <Link to="/admin/products" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>Admin</Link>}
          {userId
            ? <button className="nb-logout" style={{marginTop:8,width:"100%"}} onClick={logout}>Logout</button>
            : <Link to="/login" className="nb-login" style={{marginTop:8,justifyContent:"center"}} onClick={() => setMenuOpen(false)}>Sign In</Link>
          }
        </div>
      </nav>
    </>
  );
}