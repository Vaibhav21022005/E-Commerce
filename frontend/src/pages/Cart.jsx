import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router";
import { useNavigate } from "react-router";

export default function Cart() {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadCart = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/cart/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error("Error loading cart:", err);
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [userId]);
  const removeItem = async (productId) => {
    setRemovingId(productId);
    try {
      // ✅ FIX: was api.delete — changed to api.post to match the route
      await api.post(`/cart/remove`, { userId, productId });
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      setError("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity === 0) {
      await removeItem(productId);
      return;
    }
    setUpdatingId(productId);
    try {
      await api.post(`/cart/update`, { userId, productId, quantity });
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      setError("Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPrice =
    cart?.items?.reduce(
      (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
      0,
    ) || 0;

  const totalItems = cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .ct-root{
          min-height:100vh;
          font-family:'DM Sans',sans-serif;
          background:#0b0f1a;position:relative;
        }
        .ct-bg{
          position:fixed;inset:0;z-index:0;pointer-events:none;
          background:linear-gradient(160deg,#0b0f1a 0%,#0d1627 55%,#0b0f1a 100%);
        }
        .ct-bg::before{
          content:'';position:absolute;inset:0;
          background-image:
            linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),
            linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);
          background-size:48px 48px;
          animation:ct-grid 24s linear infinite;
        }
        @keyframes ct-grid{0%{background-position:0 0}100%{background-position:0 48px}}
        .ct-orb{
          position:fixed;border-radius:50%;filter:blur(80px);
          pointer-events:none;z-index:0;
        }
        .ct-orb1{width:450px;height:450px;background:radial-gradient(circle,rgba(0,212,255,0.05) 0%,transparent 70%);top:-80px;right:-60px;animation:ct-float 10s ease-in-out infinite alternate}
        .ct-orb2{width:350px;height:350px;background:radial-gradient(circle,rgba(100,60,255,0.04) 0%,transparent 70%);bottom:-60px;left:-60px;animation:ct-float 13s ease-in-out infinite alternate-reverse}
        @keyframes ct-float{from{transform:scale(1)}to{transform:scale(1.15)}}

        .ct-layout{
          position:relative;z-index:1;
          max-width:1000px;margin:0 auto;
          padding:40px 24px 80px;
        }
        .ct-header{
          margin-bottom:36px;
          animation:ct-rise 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes ct-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .ct-tag{
          font-size:11px;font-weight:500;letter-spacing:3px;text-transform:uppercase;
          color:#00d4ff;margin-bottom:10px;
          display:flex;align-items:center;gap:8px;
        }
        .ct-tag::before{content:'';width:20px;height:1px;background:#00d4ff;}
        .ct-h1{
          font-family:'Syne',sans-serif;
          font-size:clamp(28px,4vw,42px);font-weight:700;
          color:#fff;letter-spacing:-0.5px;
        }
        .ct-h1 span{color:#00d4ff;}
        .ct-error{
          padding:12px 16px;margin-bottom:20px;border-radius:10px;
          background:rgba(255,80,80,0.08);border:1px solid rgba(255,80,80,0.2);
          color:#ff5050;font-size:13px;
          animation:ct-rise 0.3s ease both;
        }

        /* Loading skeleton */
        .ct-skel{
          display:flex;flex-direction:column;gap:14px;
          animation:ct-rise 0.5s ease both;
        }
        .ct-skel-row{
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.06);
          border-radius:14px;padding:20px;
          display:flex;gap:16px;align-items:center;
        }
        .ct-skel-img{
          width:72px;height:72px;border-radius:10px;flex-shrink:0;
          background:linear-gradient(90deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 100%);
          background-size:200% 100%;animation:ct-shim 1.5s infinite;
        }
        .ct-skel-lines{flex:1;display:flex;flex-direction:column;gap:8px;}
        .ct-skel-line{
          height:12px;border-radius:4px;
          background:linear-gradient(90deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 100%);
          background-size:200% 100%;animation:ct-shim 1.5s infinite;
        }
        @keyframes ct-shim{0%{background-position:200% 0}100%{background-position:-200% 0}}

        /* Two-column layout */
        .ct-main{
          display:grid;grid-template-columns:1fr 340px;gap:24px;align-items:start;
        }
        /* Items list */
        .ct-items{display:flex;flex-direction:column;gap:14px;}
        .ct-item{
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:16px;padding:18px 20px;
          display:flex;align-items:center;gap:16px;
          transition:all 0.2s;
          animation:ct-rise 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .ct-item:hover{border-color:rgba(0,212,255,0.15);}
        .ct-item.removing{
          opacity:0;transform:translateX(-20px);
          transition:all 0.3s ease;
        }
        .ct-img{
          width:72px;height:72px;border-radius:10px;
          object-fit:cover;flex-shrink:0;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.06);
        }
        .ct-img-placeholder{
          width:72px;height:72px;border-radius:10px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.06);
          display:flex;align-items:center;justify-content:center;
          font-size:24px;flex-shrink:0;
        }
        .ct-info{flex:1;min-width:0;}
        .ct-item-cat{
          font-size:10px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;
          color:rgba(0,212,255,0.5);margin-bottom:4px;
        }
        .ct-item-name{
          font-family:'Syne',sans-serif;font-size:15px;font-weight:600;
          color:#fff;margin-bottom:4px;
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
        }
        .ct-item-price{
          font-size:13px;color:rgba(255,255,255,0.35);
        }
        .ct-item-subtotal{
          font-family:'Syne',sans-serif;font-size:14px;font-weight:600;color:#00d4ff;
        }
        .ct-qty{
          display:flex;align-items:center;gap:2px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:10px;padding:3px;
        }
        .ct-qty-btn{
          width:30px;height:30px;border-radius:7px;
          background:none;border:none;
          color:rgba(255,255,255,0.5);
          font-size:16px;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          transition:all 0.15s;
        }
        .ct-qty-btn:hover:not(:disabled){
          background:rgba(0,212,255,0.1);color:#00d4ff;
        }
        .ct-qty-btn:disabled{opacity:0.3;cursor:not-allowed;}
        .ct-qty-val{
          min-width:28px;text-align:center;
          font-family:'Syne',sans-serif;font-size:14px;font-weight:600;color:#fff;
        }
        .ct-remove{
          padding:7px 12px;
          background:rgba(255,80,80,0.06);
          border:1px solid rgba(255,80,80,0.15);
          border-radius:8px;
          color:#ff5050;font-size:12px;cursor:pointer;
          transition:all 0.2s;flex-shrink:0;
          font-family:'DM Sans',sans-serif;
          display:flex;align-items:center;gap:5px;
        }
        .ct-remove:hover:not(:disabled){
          background:rgba(255,80,80,0.14);
          border-color:rgba(255,80,80,0.35);
        }
        .ct-remove:disabled{opacity:0.4;cursor:not-allowed;}
        .ct-spin{
          display:inline-block;width:12px;height:12px;
          border:1.5px solid rgba(255,80,80,0.25);border-top-color:#ff5050;
          border-radius:50%;animation:ct-s 0.7s linear infinite;
        }
        @keyframes ct-s{to{transform:rotate(360deg)}}

        /* Order summary */
        .ct-summary{
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:18px;overflow:hidden;
          position:sticky;top:84px;
          animation:ct-rise 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both;
          box-shadow:0 20px 50px rgba(0,0,0,0.3);
        }
        .ct-sum-head{
          padding:18px 22px;border-bottom:1px solid rgba(255,255,255,0.05);
          background:rgba(0,212,255,0.025);
        }
        .ct-sum-head h3{
          font-family:'Syne',sans-serif;font-size:15px;font-weight:600;color:#fff;
        }
        .ct-sum-body{padding:20px 22px;}
        .ct-sum-row{
          display:flex;justify-content:space-between;align-items:center;
          margin-bottom:12px;font-size:13px;
        }
        .ct-sum-label{color:rgba(255,255,255,0.4);}
        .ct-sum-val{color:rgba(255,255,255,0.7);font-weight:500;}
        .ct-sum-divider{
          height:1px;background:rgba(255,255,255,0.06);
          margin:16px 0;
        }
        .ct-sum-total{
          display:flex;justify-content:space-between;align-items:center;
          margin-bottom:20px;
        }
        .ct-sum-total-label{
          font-family:'Syne',sans-serif;font-size:14px;font-weight:600;color:#fff;
        }
        .ct-sum-total-val{
          font-family:'Syne',sans-serif;font-size:22px;font-weight:700;color:#00d4ff;
        }
        .ct-checkout-btn{
          width:100%;padding:14px;
          background:linear-gradient(135deg,#00d4ff,#0099cc);
          border:none;border-radius:11px;
          color:#0b0f1a;font-family:'Syne',sans-serif;
          font-size:14px;font-weight:700;letter-spacing:0.5px;
          cursor:pointer;transition:all 0.25s;
          position:relative;overflow:hidden;
        }
        .ct-checkout-btn::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,0);transition:background 0.25s;}
        .ct-checkout-btn:hover:not(:disabled)::after{background:rgba(255,255,255,0.12);}
        .ct-checkout-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,212,255,0.4);}
        .ct-checkout-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .ct-sum-foot{
          padding:12px 22px;border-top:1px solid rgba(255,255,255,0.05);
          text-align:center;font-size:11px;color:rgba(255,255,255,0.2);
          display:flex;align-items:center;justify-content:center;gap:6px;
        }
        .ct-sum-foot svg{width:12px;height:12px;}

        /* Empty state */
        .ct-empty{
          text-align:center;padding:80px 24px;
          animation:ct-rise 0.6s ease both;
        }
        .ct-empty-ico{font-size:56px;margin-bottom:20px;opacity:0.3;}
        .ct-empty-title{
          font-family:'Syne',sans-serif;font-size:24px;font-weight:700;
          color:rgba(255,255,255,0.4);margin-bottom:10px;
        }
        .ct-empty-sub{font-size:14px;color:rgba(255,255,255,0.2);margin-bottom:28px;}
        .ct-shop-btn{
          display:inline-flex;align-items:center;gap:8px;
          padding:12px 28px;
          background:linear-gradient(135deg,#00d4ff,#0099cc);
          border:none;border-radius:12px;
          color:#0b0f1a;font-family:'Syne',sans-serif;
          font-size:14px;font-weight:700;letter-spacing:0.5px;
          text-decoration:none;transition:all 0.25s;
        }
        .ct-shop-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,212,255,0.4);}

        /* Not logged in */
        .ct-auth{
          text-align:center;padding:80px 24px;
          animation:ct-rise 0.6s ease both;
        }

        @media(max-width:768px){
          .ct-main{grid-template-columns:1fr;}
          .ct-summary{position:static;}
          .ct-item{flex-wrap:wrap;gap:12px;}
        }
        @media(max-width:480px){
          .ct-qty{flex-shrink:0;}
          .ct-info{width:calc(100% - 88px);}
        }
      `}</style>

      <div className="ct-root">
        <div className="ct-bg" />
        <div className="ct-orb ct-orb1" />
        <div className="ct-orb ct-orb2" />

        <div className="ct-layout">
          {/* Header */}
          <div className="ct-header">
            <div className="ct-tag">Shopping</div>
            <h1 className="ct-h1">
              Your <span>Cart</span>
            </h1>
          </div>

          {error && <div className="ct-error">! {error}</div>}

          {/* Not logged in */}
          {!userId ? (
            <div className="ct-auth">
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>
                🔒
              </div>
              <div className="ct-empty-title">Sign in to view your cart</div>
              <div className="ct-empty-sub">
                You need to be logged in to manage your cart.
              </div>
              <Link to="/login" className="ct-shop-btn">
                Sign In
              </Link>
            </div>
          ) : loading ? (
            <div className="ct-skel">
              {[1, 2, 3].map((i) => (
                <div key={i} className="ct-skel-row">
                  <div className="ct-skel-img" />
                  <div className="ct-skel-lines">
                    <div className="ct-skel-line" style={{ width: "50%" }} />
                    <div className="ct-skel-line" style={{ width: "30%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : !cart?.items?.length ? (
            <div className="ct-empty">
              <div className="ct-empty-ico">🛒</div>
              <div className="ct-empty-title">Your cart is empty</div>
              <div className="ct-empty-sub">
                Looks like you haven't added anything yet.
              </div>
              <Link to="/" className="ct-shop-btn">
                ← Browse Products
              </Link>
            </div>
          ) : (
            <div className="ct-main">
              {/* Items */}
              <div className="ct-items">
                {cart.items.map((item, i) => {
                  const p = item.productId;
                  return (
                    <div
                      key={p._id}
                      className={`ct-item ${removingId === p._id ? "removing" : ""}`}
                      style={{ animationDelay: `${i * 0.07}s` }}
                    >
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="ct-img"
                        />
                      ) : (
                        <div className="ct-img-placeholder">📦</div>
                      )}

                      <div className="ct-info">
                        <div className="ct-item-cat">{p.category}</div>
                        <div className="ct-item-name">{p.title}</div>
                        <div className="ct-item-price">
                          ₹{p.price?.toLocaleString("en-IN")} each
                        </div>
                      </div>

                      <div className="ct-item-subtotal">
                        ₹{(p.price * item.quantity).toLocaleString("en-IN")}
                      </div>

                      {/* Quantity controls */}
                      <div className="ct-qty">
                        <button
                          className="ct-qty-btn"
                          onClick={() =>
                            updateQuantity(p._id, item.quantity - 1)
                          }
                          disabled={updatingId === p._id}
                        >
                          −
                        </button>
                        <span className="ct-qty-val">{item.quantity}</span>
                        <button
                          className="ct-qty-btn"
                          onClick={() =>
                            updateQuantity(p._id, item.quantity + 1)
                          }
                          disabled={updatingId === p._id}
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        className="ct-remove"
                        onClick={() => removeItem(p._id)}
                        disabled={removingId === p._id}
                      >
                        {removingId === p._id ? (
                          <span className="ct-spin" />
                        ) : (
                          <>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="ct-summary">
                <div className="ct-sum-head">
                  <h3>Order Summary</h3>
                </div>
                <div className="ct-sum-body">
                  <div className="ct-sum-row">
                    <span className="ct-sum-label">Items ({totalItems})</span>
                    <span className="ct-sum-val">
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="ct-sum-row">
                    <span className="ct-sum-label">Shipping</span>
                    <span className="ct-sum-val" style={{ color: "#00ff80" }}>
                      Free
                    </span>
                  </div>
                  <div className="ct-sum-row">
                    <span className="ct-sum-label">Tax (18% GST)</span>
                    <span className="ct-sum-val">
                      ₹
                      {(totalPrice * 0.18).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="ct-sum-divider" />
                  <div className="ct-sum-total">
                    <span className="ct-sum-total-label">Total</span>
                    <span className="ct-sum-total-val">
                      ₹
                      {(totalPrice * 1.18).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <button
                    className="ct-checkout-btn"
                    disabled={checkingOut}
                    onClick={() => navigate("/checkout-address")}
                  >
                    {checkingOut ? "Processing…" : "Proceed to Checkout →"}
                  </button>
                </div>
                <div className="ct-sum-foot">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Secure 256-bit SSL checkout
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
