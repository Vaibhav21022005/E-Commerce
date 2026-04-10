import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate, Link } from "react-router";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [toastMsg, setToastMsg] = useState({ text: "", type: "" });

  // BUG FIX: was fetching ALL products then filtering client-side.
  // Now uses the dedicated GET /products/:id endpoint — faster and correct.
  const loadProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const showToast = (text, type = "success") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg({ text: "", type: "" }), 2500);
  };

  const addToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showToast("Please log in to add items to your cart.", "error");
      return;
    }
    setAdding(true);
    try {
      // Add the item (quantity) times by calling the API quantity times
      for (let i = 0; i < quantity; i++) {
        await api.post("/cart/add", { userId, productId: id });
      }
      window.dispatchEvent(new Event("cartUpdated"));
      showToast(`${quantity} item${quantity > 1 ? "s" : ""} added to cart!`);
    } catch (error) {
      showToast("Failed to add to cart. Try again.", "error");
    } finally {
      setAdding(false);
    }
  };

  // Normalize images — product.images might be an array or a string
  const images = Array.isArray(product?.images)
    ? product.images.filter(Boolean)
    : product?.images
    ? [product.images]
    : [];

  const stockStatus =
    !product?.stock || product.stock === 0
      ? { label: "Out of Stock", color: "#ff5050", bg: "rgba(255,80,80,0.1)", border: "rgba(255,80,80,0.25)" }
      : product.stock <= 5
      ? { label: `Only ${product.stock} left`, color: "#ffb400", bg: "rgba(255,180,0,0.1)", border: "rgba(255,180,0,0.25)" }
      : { label: "In Stock", color: "#00ff80", bg: "rgba(0,255,128,0.1)", border: "rgba(0,255,128,0.25)" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .pd-root{min-height:100vh;font-family:'DM Sans',sans-serif;background:#0b0f1a;position:relative;overflow-x:hidden;}
        .pd-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background:linear-gradient(160deg,#0b0f1a 0%,#0d1627 55%,#0b0f1a 100%);}
        .pd-bg::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);background-size:48px 48px;animation:pd-grid 24s linear infinite;}
        @keyframes pd-grid{0%{background-position:0 0}100%{background-position:0 48px}}
        .pd-orb{position:fixed;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0;}
        .pd-orb1{width:500px;height:500px;background:radial-gradient(circle,rgba(0,212,255,0.06) 0%,transparent 70%);top:-100px;right:-80px;animation:pd-float 10s ease-in-out infinite alternate;}
        .pd-orb2{width:400px;height:400px;background:radial-gradient(circle,rgba(100,60,255,0.04) 0%,transparent 70%);bottom:-80px;left:-80px;animation:pd-float 13s ease-in-out infinite alternate-reverse;}
        @keyframes pd-float{from{transform:scale(1)}to{transform:scale(1.15) translate(15px,-15px)}}

        .pd-layout{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:32px 24px 80px;}

        /* Breadcrumb */
        .pd-crumb{
          display:flex;align-items:center;gap:8px;
          margin-bottom:32px;font-size:13px;
          color:rgba(255,255,255,0.3);
          animation:pd-rise 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes pd-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .pd-crumb a{color:rgba(0,212,255,0.6);text-decoration:none;transition:color 0.2s;}
        .pd-crumb a:hover{color:#00d4ff;}
        .pd-crumb-sep{opacity:0.3;}

        /* Main grid */
        .pd-grid{
          display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start;
          animation:pd-rise 0.6s 0.05s cubic-bezier(0.16,1,0.3,1) both;
        }

        /* Image section */
        .pd-img-section{}
        .pd-main-img-wrap{
          position:relative;width:100%;padding-top:100%;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:20px;overflow:hidden;margin-bottom:12px;
          cursor:zoom-in;
        }
        .pd-main-img{
          position:absolute;inset:0;width:100%;height:100%;
          object-fit:contain;padding:16px;
          transition:transform 0.4s ease;
        }
        .pd-main-img-wrap:hover .pd-main-img{transform:scale(1.04);}
        .pd-no-img{
          position:absolute;inset:0;
          display:flex;align-items:center;justify-content:center;
          font-size:64px;opacity:0.15;
        }
        /* Thumbnails */
        .pd-thumbs{display:flex;gap:8px;flex-wrap:wrap;}
        .pd-thumb{
          width:64px;height:64px;border-radius:10px;overflow:hidden;
          border:1px solid rgba(255,255,255,0.08);
          cursor:pointer;transition:all 0.2s;
          background:rgba(255,255,255,0.03);
          flex-shrink:0;
        }
        .pd-thumb.active{border-color:rgba(0,212,255,0.6);box-shadow:0 0 0 2px rgba(0,212,255,0.2);}
        .pd-thumb:hover:not(.active){border-color:rgba(255,255,255,0.25);}
        .pd-thumb img{width:100%;height:100%;object-fit:contain;padding:4px;}

        /* Info section */
        .pd-info{}
        .pd-cat{
          font-size:11px;font-weight:500;letter-spacing:3px;text-transform:uppercase;
          color:#00d4ff;margin-bottom:12px;
          display:flex;align-items:center;gap:8px;
        }
        .pd-cat::before{content:'';width:16px;height:1px;background:#00d4ff;}
        .pd-title{
          font-family:'Syne',sans-serif;
          font-size:clamp(24px,3.5vw,38px);font-weight:700;
          color:#fff;letter-spacing:-0.5px;line-height:1.15;
          margin-bottom:16px;
        }

        /* Stock badge */
        .pd-stock-badge{
          display:inline-flex;align-items:center;gap:6px;
          padding:5px 14px;border-radius:20px;
          font-size:12px;font-weight:500;
          margin-bottom:20px;
          border:1px solid;
        }
        .pd-stock-dot{width:6px;height:6px;border-radius:50%;}

        /* Rating row — decorative */
        .pd-meta{
          display:flex;align-items:center;gap:16px;
          margin-bottom:20px;
          padding-bottom:20px;
          border-bottom:1px solid rgba(255,255,255,0.06);
        }
        .pd-stars{display:flex;gap:2px;}
        .pd-star{font-size:13px;}
        .pd-meta-sep{width:1px;height:16px;background:rgba(255,255,255,0.1);}
        .pd-meta-txt{font-size:12px;color:rgba(255,255,255,0.3);}

        /* Price */
        .pd-price-row{
          display:flex;align-items:baseline;gap:12px;
          margin-bottom:8px;
        }
        .pd-price{
          font-family:'Syne',sans-serif;
          font-size:clamp(28px,3vw,40px);font-weight:700;color:#00d4ff;
        }
        .pd-gst{font-size:12px;color:rgba(255,255,255,0.25);margin-bottom:20px;}

        /* Description */
        .pd-desc{
          font-size:14px;font-weight:300;color:rgba(255,255,255,0.45);
          line-height:1.8;margin-bottom:28px;
        }
        .pd-desc.empty{
          font-style:italic;color:rgba(255,255,255,0.2);
        }

        /* Quantity selector */
        .pd-qty-row{
          display:flex;align-items:center;gap:12px;margin-bottom:20px;
        }
        .pd-qty-label{
          font-size:12px;font-weight:500;letter-spacing:1px;text-transform:uppercase;
          color:rgba(255,255,255,0.35);min-width:70px;
        }
        .pd-qty-ctrl{
          display:flex;align-items:center;gap:2px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:10px;padding:3px;
        }
        .pd-qty-btn{
          width:34px;height:34px;border-radius:7px;
          background:none;border:none;
          color:rgba(255,255,255,0.5);font-size:18px;
          cursor:pointer;transition:all 0.15s;
          display:flex;align-items:center;justify-content:center;
        }
        .pd-qty-btn:hover:not(:disabled){background:rgba(0,212,255,0.1);color:#00d4ff;}
        .pd-qty-btn:disabled{opacity:0.25;cursor:not-allowed;}
        .pd-qty-val{
          min-width:36px;text-align:center;
          font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:#fff;
        }

        /* Action buttons */
        .pd-actions{display:flex;gap:10px;margin-bottom:24px;}
        .pd-add-btn{
          flex:1;padding:15px;
          background:linear-gradient(135deg,#00d4ff,#0099cc);
          border:none;border-radius:12px;
          color:#0b0f1a;font-family:'Syne',sans-serif;
          font-size:15px;font-weight:700;letter-spacing:0.5px;
          cursor:pointer;transition:all 0.25s;
          position:relative;overflow:hidden;
        }
        .pd-add-btn::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,0);transition:background 0.25s;}
        .pd-add-btn:hover:not(:disabled)::after{background:rgba(255,255,255,0.12);}
        .pd-add-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 10px 28px rgba(0,212,255,0.4);}
        .pd-add-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .pd-cart-btn{
          padding:15px 18px;
          background:transparent;
          border:1px solid rgba(255,255,255,0.1);
          border-radius:12px;color:rgba(255,255,255,0.45);
          cursor:pointer;transition:all 0.2s;text-decoration:none;
          display:flex;align-items:center;
        }
        .pd-cart-btn:hover{border-color:rgba(0,212,255,0.3);color:#00d4ff;background:rgba(0,212,255,0.05);}
        .pd-spin{
          display:inline-block;width:16px;height:16px;
          border:2px solid rgba(11,15,26,0.25);border-top-color:#0b0f1a;
          border-radius:50%;animation:pd-s 0.7s linear infinite;vertical-align:middle;margin-right:8px;
        }
        @keyframes pd-s{to{transform:rotate(360deg)}}

        /* Info pills */
        .pd-pills{display:flex;flex-wrap:wrap;gap:8px;}
        .pd-pill{
          display:flex;align-items:center;gap:6px;
          padding:7px 14px;border-radius:8px;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.07);
          font-size:12px;color:rgba(255,255,255,0.35);
        }
        .pd-pill svg{width:13px;height:13px;color:rgba(0,212,255,0.6);}

        /* Loading state */
        .pd-loading{
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          min-height:60vh;gap:20px;
          animation:pd-rise 0.5s ease both;
        }
        .pd-loading-spin{
          width:40px;height:40px;
          border:3px solid rgba(0,212,255,0.15);
          border-top-color:#00d4ff;
          border-radius:50%;
          animation:pd-s 0.8s linear infinite;
        }
        .pd-loading-text{font-size:14px;color:rgba(255,255,255,0.25);}

        /* Not found */
        .pd-notfound{text-align:center;padding:80px 24px;animation:pd-rise 0.5s ease both;}
        .pd-notfound-ico{font-size:48px;margin-bottom:16px;opacity:0.3;}
        .pd-notfound-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:700;color:rgba(255,255,255,0.4);margin-bottom:8px;}
        .pd-notfound-sub{font-size:13px;color:rgba(255,255,255,0.2);margin-bottom:24px;}
        .pd-back-btn{
          display:inline-flex;align-items:center;gap:8px;
          padding:11px 24px;
          background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.25);
          border-radius:10px;color:#00d4ff;font-size:13px;
          text-decoration:none;transition:all 0.2s;
        }
        .pd-back-btn:hover{background:rgba(0,212,255,0.18);}

        /* Toast */
        .pd-toast{
          position:fixed;bottom:28px;right:28px;z-index:200;
          padding:13px 20px;border-radius:12px;
          background:rgba(11,15,26,0.95);
          color:#fff;font-size:14px;
          box-shadow:0 8px 32px rgba(0,0,0,0.5);
          animation:pd-toastin 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
          backdrop-filter:blur(12px);
          display:flex;align-items:center;gap:10px;
        }
        .pd-toast.success{border:1px solid rgba(0,212,255,0.25);}
        .pd-toast.error{border:1px solid rgba(255,80,80,0.25);}
        .pd-toast-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
        .pd-toast.success .pd-toast-dot{background:#00d4ff;}
        .pd-toast.error .pd-toast-dot{background:#ff5050;}
        @keyframes pd-toastin{from{opacity:0;transform:translateY(14px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}

        @media(max-width:768px){
          .pd-grid{grid-template-columns:1fr;gap:28px;}
          .pd-main-img-wrap{padding-top:75%;}
        }
      `}</style>

      <div className="pd-root">
        <div className="pd-bg"/><div className="pd-orb pd-orb1"/><div className="pd-orb pd-orb2"/>
        <div className="pd-layout">

          {/* Breadcrumb */}
          <div className="pd-crumb">
            <Link to="/">Home</Link>
            <span className="pd-crumb-sep">›</span>
            {product?.category && (
              <><span>{product.category}</span><span className="pd-crumb-sep">›</span></>
            )}
            <span style={{color:"rgba(255,255,255,0.55)",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {loading ? "Loading…" : product?.title || "Product"}
            </span>
          </div>

          {loading ? (
            <div className="pd-loading">
              <div className="pd-loading-spin"/>
              <span className="pd-loading-text">Loading product…</span>
            </div>
          ) : !product ? (
            <div className="pd-notfound">
              <div className="pd-notfound-ico">🔍</div>
              <div className="pd-notfound-title">Product not found</div>
              <div className="pd-notfound-sub">This product may have been removed or the link is incorrect.</div>
              <Link to="/" className="pd-back-btn">← Back to Products</Link>
            </div>
          ) : (
            <div className="pd-grid">
              {/* ── LEFT: Images ── */}
              <div className="pd-img-section">
                <div className="pd-main-img-wrap">
                  {images[selectedImg] ? (
                    <img
                      src={images[selectedImg]}
                      alt={product.title}
                      className="pd-main-img"
                    />
                  ) : (
                    <div className="pd-no-img">📦</div>
                  )}
                </div>

                {/* Thumbnails — only show when 2+ images */}
                {images.length > 1 && (
                  <div className="pd-thumbs">
                    {images.map((src, i) => (
                      <div
                        key={i}
                        className={`pd-thumb ${selectedImg === i ? "active" : ""}`}
                        onClick={() => setSelectedImg(i)}
                      >
                        <img src={src} alt={`${product.title} view ${i + 1}`}/>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── RIGHT: Info ── */}
              <div className="pd-info">
                <div className="pd-cat">{product.category}</div>
                <h1 className="pd-title">{product.title}</h1>

                {/* Stock badge */}
                <div
                  className="pd-stock-badge"
                  style={{
                    color: stockStatus.color,
                    background: stockStatus.bg,
                    borderColor: stockStatus.border,
                  }}
                >
                  <div className="pd-stock-dot" style={{background: stockStatus.color}}/>
                  {stockStatus.label}
                </div>

                {/* Rating row — decorative */}
                <div className="pd-meta">
                  <div className="pd-stars">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className="pd-star" style={{opacity: s <= 4 ? 1 : 0.25}}>★</span>
                    ))}
                  </div>
                  <div className="pd-meta-sep"/>
                  <span className="pd-meta-txt">4.0 · 128 reviews</span>
                  <div className="pd-meta-sep"/>
                  <span className="pd-meta-txt">ID: #{id.slice(-6).toUpperCase()}</span>
                </div>

                {/* Price */}
                <div className="pd-price-row">
                  <span className="pd-price">₹{product.price?.toLocaleString("en-IN")}</span>
                </div>
                <div className="pd-gst">Inclusive of all taxes (18% GST)</div>

                {/* Description */}
                <p className={`pd-desc ${!product.description ? "empty" : ""}`}>
                  {product.description || "No description available for this product."}
                </p>

                {/* Quantity */}
                <div className="pd-qty-row">
                  <span className="pd-qty-label">Quantity</span>
                  <div className="pd-qty-ctrl">
                    <button
                      className="pd-qty-btn"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >−</button>
                    <span className="pd-qty-val">{quantity}</span>
                    <button
                      className="pd-qty-btn"
                      onClick={() => setQuantity(q => Math.min(product.stock || 1, q + 1))}
                      disabled={quantity >= (product.stock || 1)}
                    >+</button>
                  </div>
                  {product.stock > 0 && (
                    <span style={{fontSize:12,color:"rgba(255,255,255,0.2)"}}>
                      {product.stock} available
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="pd-actions">
                  <button
                    className="pd-add-btn"
                    onClick={addToCart}
                    disabled={adding || product.stock === 0}
                  >
                    {adding && <span className="pd-spin"/>}
                    {adding
                      ? "Adding…"
                      : product.stock === 0
                      ? "Out of Stock"
                      : `Add ${quantity > 1 ? `${quantity} items` : "to Cart"}`
                    }
                  </button>
                  <Link to="/cart" className="pd-cart-btn" title="Go to cart">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                  </Link>
                </div>

                {/* Info pills */}
                <div className="pd-pills">
                  {[
                    { icon: <path d="M5 12h14M12 5l7 7-7 7"/>, label: "Free Delivery" },
                    { icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>, label: "30-Day Returns" },
                    { icon: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>, label: "Secure Payment" },
                  ].map((p, i) => (
                    <div key={i} className="pd-pill">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {p.icon}
                      </svg>
                      {p.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {toastMsg.text && (
        <div className={`pd-toast ${toastMsg.type}`}>
          <div className="pd-toast-dot"/>
          {toastMsg.text}
        </div>
      )}
    </>
  );
}