import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { Link } from "react-router";

// Debounce hook — waits 400ms after user stops typing before triggering search
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "books", label: "Books" },
  { value: "accessories", label: "Accessories" },
  { value: "footwear", label: "Footwear" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  // Debounce the search so we don't fire on every keystroke
  const debouncedSearch = useDebounce(search, 400);

  // SEARCH FIX: Send search and category as query params to the backend.
  // The backend productController now filters using $regex on title/description.
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());
      if (category.trim())         params.append("category", category.trim());

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showToast("Please log in to add items to your cart.");
      return;
    }
    setAddingId(productId);
    try {
      await api.post("/cart/add", { userId, productId });
      window.dispatchEvent(new Event("cartUpdated"));
      showToast("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Failed to add item.");
    } finally {
      setAddingId(null);
    }
  };

  const clearSearch = () => { setSearch(""); setCategory(""); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .hm-root{
          min-height:100vh;
          font-family:'DM Sans',sans-serif;
          background:#0b0f1a;
          position:relative;
        }
        /* Background */
        .hm-bg{
          position:fixed;inset:0;z-index:0;pointer-events:none;
          background:linear-gradient(160deg,#0b0f1a 0%,#0d1627 55%,#0b0f1a 100%);
        }
        .hm-bg::before{
          content:'';position:absolute;inset:0;
          background-image:
            linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),
            linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);
          background-size:48px 48px;
          animation:hm-grid 24s linear infinite;
        }
        @keyframes hm-grid{0%{background-position:0 0}100%{background-position:0 48px}}
        .hm-orb{
          position:fixed;border-radius:50%;
          filter:blur(80px);pointer-events:none;z-index:0;
        }
        .hm-orb1{width:500px;height:500px;background:radial-gradient(circle,rgba(0,212,255,0.06) 0%,transparent 70%);top:-100px;right:-80px;animation:hm-float 10s ease-in-out infinite alternate}
        .hm-orb2{width:400px;height:400px;background:radial-gradient(circle,rgba(100,60,255,0.04) 0%,transparent 70%);bottom:-80px;left:-80px;animation:hm-float 13s ease-in-out infinite alternate-reverse}
        @keyframes hm-float{from{transform:scale(1)}to{transform:scale(1.15) translate(20px,-20px)}}

        .hm-layout{position:relative;z-index:1;max-width:1200px;margin:0 auto;padding:40px 24px 80px}

        /* Hero */
        .hm-hero{
          text-align:center;padding:48px 0 44px;
          animation:hm-rise 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes hm-rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .hm-hero-tag{
          font-size:11px;font-weight:500;letter-spacing:3px;text-transform:uppercase;
          color:#00d4ff;margin-bottom:14px;
          display:inline-flex;align-items:center;gap:8px;
        }
        .hm-hero-tag::before,.hm-hero-tag::after{content:'';width:24px;height:1px;background:#00d4ff;}
        .hm-hero h1{
          font-family:'Syne',sans-serif;
          font-size:clamp(32px,5vw,60px);font-weight:700;
          color:#fff;letter-spacing:-1px;line-height:1.1;
          margin-bottom:14px;
        }
        .hm-hero h1 span{color:#00d4ff;}
        .hm-hero p{
          font-size:15px;font-weight:300;
          color:rgba(255,255,255,0.38);
          max-width:420px;margin:0 auto;line-height:1.7;
        }

        /* Controls */
        .hm-controls{
          display:flex;gap:12px;margin-bottom:36px;flex-wrap:wrap;
          animation:hm-rise 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both;
        }
        .hm-search-wrap{
          flex:1;min-width:220px;position:relative;
        }
        .hm-search-ico{
          position:absolute;left:14px;top:50%;transform:translateY(-50%);
          color:rgba(0,212,255,0.45);pointer-events:none;
        }
        .hm-search-ico svg{width:16px;height:16px;}
        .hm-search{
          width:100%;padding:13px 16px 13px 44px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:12px;color:#fff;
          font-family:'DM Sans',sans-serif;font-size:14px;
          outline:none;transition:all 0.25s;
        }
        .hm-search::placeholder{color:rgba(255,255,255,0.2);}
        .hm-search:focus{
          border-color:rgba(0,212,255,0.45);
          background:rgba(0,212,255,0.05);
          box-shadow:0 0 0 3px rgba(0,212,255,0.07);
        }
        .hm-clear{
          position:absolute;right:12px;top:50%;transform:translateY(-50%);
          background:none;border:none;color:rgba(255,255,255,0.3);
          cursor:pointer;font-size:16px;padding:2px;
          transition:color 0.2s;
        }
        .hm-clear:hover{color:#ff5050;}
        .hm-select{
          padding:13px 16px;min-width:160px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:12px;color:#fff;
          font-family:'DM Sans',sans-serif;font-size:14px;
          outline:none;cursor:pointer;transition:all 0.25s;
          appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(0,212,255,0.5)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat:no-repeat;background-position:right 14px center;
          padding-right:38px;
        }
        .hm-select:focus{border-color:rgba(0,212,255,0.45);background-color:rgba(0,212,255,0.05);}
        .hm-select option{background:#12192d;color:#fff;}

        /* Results bar */
        .hm-results-bar{
          display:flex;align-items:center;justify-content:space-between;
          margin-bottom:20px;
        }
        .hm-count{
          font-size:13px;color:rgba(255,255,255,0.3);
        }
        .hm-count strong{color:#00d4ff;font-weight:500;}
        .hm-active-filter{
          display:inline-flex;align-items:center;gap:6px;
          padding:4px 12px;
          background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.2);
          border-radius:20px;font-size:12px;color:#00d4ff;cursor:pointer;
          transition:all 0.2s;
        }
        .hm-active-filter:hover{background:rgba(255,80,80,0.08);border-color:rgba(255,80,80,0.25);color:#ff5050;}

        /* Grid */
        .hm-grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
          gap:20px;
        }

        /* Card */
        .hm-card{
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:16px;overflow:hidden;
          transition:all 0.3s;
          animation:hm-rise 0.5s cubic-bezier(0.16,1,0.3,1) both;
          display:flex;flex-direction:column;
        }
        .hm-card:hover{
          border-color:rgba(0,212,255,0.25);
          transform:translateY(-4px);
          box-shadow:0 16px 40px rgba(0,0,0,0.4),0 0 0 1px rgba(0,212,255,0.1);
        }
        .hm-img-wrap{
          position:relative;overflow:hidden;
          height:200px;background:rgba(255,255,255,0.03);
        }
        .hm-img{
          width:100%;height:100%;object-fit:cover;
          transition:transform 0.4s ease;
        }
        .hm-card:hover .hm-img{transform:scale(1.05);}
        .hm-img-placeholder{
          width:100%;height:100%;
          display:flex;align-items:center;justify-content:center;
          color:rgba(255,255,255,0.1);font-size:40px;
        }
        .hm-badge{
          position:absolute;top:10px;left:10px;
          padding:3px 10px;border-radius:20px;
          background:rgba(0,212,255,0.15);border:1px solid rgba(0,212,255,0.3);
          font-size:10px;font-weight:500;letter-spacing:1px;text-transform:uppercase;
          color:#00d4ff;
        }
        .hm-card-body{
          padding:16px 18px 18px;
          display:flex;flex-direction:column;flex:1;
        }
        .hm-card-cat{
          font-size:10px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;
          color:rgba(0,212,255,0.5);margin-bottom:6px;
        }
        .hm-card-title{
          font-family:'Syne',sans-serif;
          font-size:15px;font-weight:600;color:#fff;
          margin-bottom:8px;line-height:1.3;
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
        }
        .hm-card-price{
          font-family:'Syne',sans-serif;
          font-size:18px;font-weight:700;color:#00d4ff;
          margin-bottom:auto;
        }
        .hm-card-stock{
          font-size:11px;color:rgba(255,255,255,0.25);margin-top:4px;margin-bottom:14px;
        }
        .hm-card-stock.low{color:#ff5050;}
        .hm-card-footer{
          display:flex;gap:8px;margin-top:14px;
        }
        .hm-view-btn{
          flex:0;padding:9px 14px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:9px;color:rgba(255,255,255,0.5);
          font-size:12px;text-decoration:none;
          transition:all 0.2s;display:flex;align-items:center;
        }
        .hm-view-btn:hover{color:#fff;border-color:rgba(255,255,255,0.25);}
        .hm-add-btn{
          flex:1;padding:9px;
          background:linear-gradient(135deg,#00d4ff,#0099cc);
          border:none;border-radius:9px;
          color:#0b0f1a;font-family:'Syne',sans-serif;
          font-size:13px;font-weight:700;
          cursor:pointer;transition:all 0.25s;
          position:relative;overflow:hidden;
        }
        .hm-add-btn::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,0);transition:background 0.2s;}
        .hm-add-btn:hover:not(:disabled)::after{background:rgba(255,255,255,0.12);}
        .hm-add-btn:hover:not(:disabled){box-shadow:0 4px 16px rgba(0,212,255,0.35);}
        .hm-add-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .hm-spin{
          display:inline-block;width:13px;height:13px;
          border:2px solid rgba(11,15,26,0.25);border-top-color:#0b0f1a;
          border-radius:50%;animation:hm-s 0.7s linear infinite;vertical-align:middle;
        }
        @keyframes hm-s{to{transform:rotate(360deg)}}

        /* Skeleton */
        .hm-skel-card{
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.05);
          border-radius:16px;overflow:hidden;
        }
        .hm-skel-img{height:200px;background:rgba(255,255,255,0.04);animation:hm-shim 1.5s infinite;}
        .hm-skel-body{padding:16px 18px 18px;}
        .hm-skel-line{
          height:12px;border-radius:4px;margin-bottom:10px;
          background:linear-gradient(90deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 100%);
          background-size:200% 100%;animation:hm-shim 1.5s infinite;
        }
        @keyframes hm-shim{0%{background-position:200% 0}100%{background-position:-200% 0}}

        /* Empty state */
        .hm-empty{
          grid-column:1/-1;text-align:center;padding:80px 24px;
        }
        .hm-empty-ico{font-size:48px;margin-bottom:16px;opacity:0.3;}
        .hm-empty-title{
          font-family:'Syne',sans-serif;font-size:20px;font-weight:600;
          color:rgba(255,255,255,0.4);margin-bottom:8px;
        }
        .hm-empty-sub{font-size:13px;color:rgba(255,255,255,0.2);}
        .hm-empty-btn{
          margin-top:20px;padding:10px 24px;
          background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.2);
          border-radius:10px;color:#00d4ff;font-size:13px;cursor:pointer;
          transition:all 0.2s;font-family:'DM Sans',sans-serif;
        }
        .hm-empty-btn:hover{background:rgba(0,212,255,0.18);}

        /* Toast */
        .hm-toast{
          position:fixed;bottom:28px;right:28px;z-index:200;
          padding:13px 20px;border-radius:12px;
          background:rgba(11,15,26,0.95);
          border:1px solid rgba(0,212,255,0.25);
          color:#fff;font-size:14px;
          box-shadow:0 8px 32px rgba(0,0,0,0.5);
          animation:hm-toastin 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
          backdrop-filter:blur(12px);
          display:flex;align-items:center;gap:10px;
        }
        .hm-toast-dot{width:6px;height:6px;border-radius:50%;background:#00d4ff;flex-shrink:0;}
        @keyframes hm-toastin{from{opacity:0;transform:translateY(16px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}

        @media(max-width:480px){
          .hm-controls{flex-direction:column;}
          .hm-select{width:100%;}
        }
      `}</style>

      <div className="hm-root">
        <div className="hm-bg"/>
        <div className="hm-orb hm-orb1"/>
        <div className="hm-orb hm-orb2"/>

        <div className="hm-layout">
          {/* Hero */}
          <div className="hm-hero">
            <div className="hm-hero-tag">New Arrivals</div>
            <h1>Discover <span>Premium</span><br/>Products</h1>
            <p>Curated collections for the discerning shopper. Quality guaranteed.</p>
          </div>

          {/* Controls */}
          <div className="hm-controls">
            <div className="hm-search-wrap">
              <span className="hm-search-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </span>
              <input
                className="hm-search"
                placeholder="Search products by name or description…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {(search || category) && (
                <button className="hm-clear" onClick={clearSearch} title="Clear filters">✕</button>
              )}
            </div>
            <select
              className="hm-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Results bar */}
          {!loading && (
            <div className="hm-results-bar">
              <span className="hm-count">
                Showing <strong>{products.length}</strong> product{products.length !== 1 ? "s" : ""}
                {debouncedSearch && <> for "<strong>{debouncedSearch}</strong>"</>}
              </span>
              {(debouncedSearch || category) && (
                <span className="hm-active-filter" onClick={clearSearch}>
                  Clear filters ✕
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          <div className="hm-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="hm-skel-card" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="hm-skel-img"/>
                  <div className="hm-skel-body">
                    <div className="hm-skel-line" style={{ width: "40%" }}/>
                    <div className="hm-skel-line" style={{ width: "80%" }}/>
                    <div className="hm-skel-line" style={{ width: "30%" }}/>
                  </div>
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="hm-empty">
                <div className="hm-empty-ico">🔍</div>
                <div className="hm-empty-title">No products found</div>
                <div className="hm-empty-sub">
                  {debouncedSearch
                    ? `No results for "${debouncedSearch}" — try a different keyword`
                    : "No products in this category yet"}
                </div>
                <button className="hm-empty-btn" onClick={clearSearch}>Clear filters</button>
              </div>
            ) : (
              products.map((product, i) => (
                <div
                  key={product._id}
                  className="hm-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="hm-img-wrap">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.title} className="hm-img"/>
                    ) : (
                      <div className="hm-img-placeholder">📦</div>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="hm-badge">Low Stock</span>
                    )}
                  </div>
                  <div className="hm-card-body">
                    <div className="hm-card-cat">{product.category}</div>
                    <div className="hm-card-title" title={product.title}>{product.title}</div>
                    <div className="hm-card-price">₹{product.price?.toLocaleString("en-IN")}</div>
                    <div className={`hm-card-stock ${product.stock <= 5 ? "low" : ""}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </div>
                    <div className="hm-card-footer">
                      <Link to={`/product/${product._id}`} className="hm-view-btn" title="View details">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      </Link>
                      <button
                        className="hm-add-btn"
                        onClick={() => addToCart(product._id)}
                        disabled={addingId === product._id || product.stock === 0}
                      >
                        {addingId === product._id
                          ? <span className="hm-spin"/>
                          : product.stock === 0 ? "Out of Stock" : "+ Add to Cart"
                        }
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toastMsg && (
        <div className="hm-toast">
          <div className="hm-toast-dot"/>
          {toastMsg}
        </div>
      )}
    </>
  );
}