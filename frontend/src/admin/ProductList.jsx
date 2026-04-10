import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async () => {
    try {
      await api.delete(`/products/delete/${deleteId}`);
      setDeleteId(null);
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalValue = products.reduce((s, p) => s + (p.price || 0), 0);
  const lowStock = products.filter((p) => p.stock <= 5).length;
  const categories = [...new Set(products.map((p) => p.category))].length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .pl-root{min-height:100vh;font-family:'DM Sans',sans-serif;background:#0b0f1a;position:relative;overflow-x:hidden}
        .pl-bg{position:fixed;inset:0;z-index:0;background:linear-gradient(160deg,#0b0f1a 0%,#0d1627 55%,#0b0f1a 100%)}
        .pl-bg::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px);background-size:48px 48px;animation:pl-grid 22s linear infinite}
        @keyframes pl-grid{0%{background-position:0 0}100%{background-position:0 48px}}
        .pl-orb1{position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(0,212,255,0.06) 0%,transparent 70%);top:-150px;right:-100px;animation:pl-float 9s ease-in-out infinite alternate;pointer-events:none;z-index:0}
        .pl-orb2{position:fixed;width:350px;height:350px;border-radius:50%;background:radial-gradient(circle,rgba(120,80,255,0.05) 0%,transparent 70%);bottom:-80px;left:-80px;animation:pl-float 12s ease-in-out infinite alternate-reverse;pointer-events:none;z-index:0}
        @keyframes pl-float{from{transform:translate(0,0) scale(1)}to{transform:translate(30px,-30px) scale(1.1)}}
        .pl-layout{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:32px 24px 60px}
        .pl-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:36px;padding-bottom:20px;border-bottom:1px solid rgba(0,212,255,0.1)}
        .pl-brand{display:flex;align-items:center;gap:10px}
        .pl-dot{width:8px;height:8px;border-radius:50%;background:#00d4ff;box-shadow:0 0 12px rgba(0,212,255,0.9);animation:pl-pulse 2s ease-in-out infinite}
        @keyframes pl-pulse{0%,100%{box-shadow:0 0 8px rgba(0,212,255,0.8)}50%{box-shadow:0 0 22px rgba(0,212,255,1)}}
        .pl-brand-text{font-family:'Syne',sans-serif;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.35)}
        .pl-add-btn{display:flex;align-items:center;gap:8px;padding:10px 20px;background:linear-gradient(135deg,#00d4ff,#0099cc);border:none;border-radius:10px;color:#0b0f1a;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;text-decoration:none;transition:all 0.25s}
        .pl-add-btn:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(0,212,255,0.38)}
        .pl-header{margin-bottom:28px;animation:pl-rise 0.6s cubic-bezier(0.16,1,0.3,1) both}
        @keyframes pl-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .pl-tag{font-size:11px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:#00d4ff;margin-bottom:8px;display:flex;align-items:center;gap:8px}
        .pl-tag::before{content:'';width:20px;height:1px;background:#00d4ff}
        .pl-h1{font-family:'Syne',sans-serif;font-size:clamp(26px,4vw,42px);font-weight:700;color:#fff;letter-spacing:-0.5px}
        .pl-h1 span{color:#00d4ff}
        .pl-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px;animation:pl-rise 0.6s 0.05s cubic-bezier(0.16,1,0.3,1) both}
        .pl-stat{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:20px;position:relative;overflow:hidden;transition:border-color 0.2s,transform 0.2s}
        .pl-stat:hover{border-color:rgba(0,212,255,0.2);transform:translateY(-2px)}
        .pl-stat-stripe{position:absolute;top:0;left:0;right:0;height:2px;border-radius:14px 14px 0 0}
        .pl-stat-lbl{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:8px}
        .pl-stat-v{font-family:'Syne',sans-serif;font-size:24px;font-weight:700;color:#fff}
        .pl-stat-sub{font-size:11px;color:rgba(255,255,255,0.2);margin-top:4px}
        .pl-controls{display:flex;align-items:center;gap:12px;margin-bottom:20px;animation:pl-rise 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both}
        .pl-sw{position:relative;flex:1}
        .pl-sico{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(0,212,255,0.4);font-size:15px;pointer-events:none}
        .pl-search{width:100%;padding:11px 16px 11px 42px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:all 0.25s}
        .pl-search::placeholder{color:rgba(255,255,255,0.2)}
        .pl-search:focus{border-color:rgba(0,212,255,0.4);background:rgba(0,212,255,0.04)}
        .pl-badge{padding:8px 16px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.2);border-radius:8px;font-size:13px;color:#00d4ff;font-family:'Syne',sans-serif;font-weight:600;white-space:nowrap}
        .pl-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:18px;overflow:hidden;animation:pl-rise 0.7s 0.15s cubic-bezier(0.16,1,0.3,1) both;box-shadow:0 24px 60px rgba(0,0,0,0.4)}
        .pl-thead{display:grid;grid-template-columns:2fr 1fr 1.2fr 0.7fr 1.2fr;padding:14px 24px;border-bottom:1px solid rgba(255,255,255,0.05);background:rgba(0,212,255,0.025)}
        .pl-th{font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(0,212,255,0.5)}
        .pl-th.c{text-align:center}.pl-th.r{text-align:right}
        .pl-skel{padding:20px 24px;display:flex;flex-direction:column;gap:14px}
        .pl-skel-row{display:flex;gap:16px;align-items:center}
        .pl-skel-b{height:14px;border-radius:4px;background:linear-gradient(90deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 100%);background-size:200% 100%;animation:pl-shim 1.5s infinite}
        @keyframes pl-shim{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .pl-row{display:grid;grid-template-columns:2fr 1fr 1.2fr 0.7fr 1.2fr;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.04);align-items:center;transition:background 0.15s}
        .pl-row:last-child{border-bottom:none}
        .pl-row:hover{background:rgba(0,212,255,0.025)}
        .pl-pname{font-size:14px;font-weight:500;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px}
        .pl-pid{font-size:11px;color:rgba(255,255,255,0.22);margin-top:3px;letter-spacing:0.3px}
        .pl-price{font-family:'Syne',sans-serif;font-size:15px;font-weight:600;color:#00d4ff}
        .pl-cat{display:inline-flex;align-items:center;padding:4px 10px;border-radius:6px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.15);font-size:12px;color:rgba(0,212,255,0.8);white-space:nowrap}
        .pl-stock{text-align:center;font-family:'Syne',sans-serif;font-size:14px;font-weight:600}
        .pl-stock.low{color:#ff5050}.pl-stock.mid{color:#ffb400}.pl-stock.ok{color:#00ff80}
        .pl-acts{display:flex;align-items:center;justify-content:flex-end;gap:8px}
        .pl-edit{padding:7px 14px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.2);border-radius:7px;color:#00d4ff;font-size:12px;font-weight:500;text-decoration:none;transition:all 0.2s;font-family:'DM Sans',sans-serif}
        .pl-edit:hover{background:rgba(0,212,255,0.15);border-color:rgba(0,212,255,0.45)}
        .pl-del{padding:7px 14px;background:rgba(255,80,80,0.08);border:1px solid rgba(255,80,80,0.2);border-radius:7px;color:#ff5050;font-size:12px;font-weight:500;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif}
        .pl-del:hover{background:rgba(255,80,80,0.15);border-color:rgba(255,80,80,0.45)}
        .pl-empty{text-align:center;padding:64px 24px}
        .pl-empty-ico{font-size:44px;margin-bottom:16px;opacity:0.35}
        .pl-empty-txt{font-size:15px;color:rgba(255,255,255,0.28)}
        .pl-overlay{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,0.72);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);animation:pl-fade 0.2s ease both}
        @keyframes pl-fade{from{opacity:0}to{opacity:1}}
        .pl-modal{background:#12192d;border:1px solid rgba(255,80,80,0.2);border-radius:20px;padding:36px;max-width:380px;width:90%;box-shadow:0 40px 80px rgba(0,0,0,0.6);animation:pl-rise 0.3s cubic-bezier(0.16,1,0.3,1) both}
        .pl-modal-ico{width:54px;height:54px;background:rgba(255,80,80,0.1);border:1px solid rgba(255,80,80,0.25);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:20px}
        .pl-modal h3{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:#fff;margin-bottom:8px}
        .pl-modal p{font-size:13px;color:rgba(255,255,255,0.38);line-height:1.7;margin-bottom:24px}
        .pl-modal-btns{display:flex;gap:10px}
        .pl-mc{flex:1;padding:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:rgba(255,255,255,0.5);font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;transition:all 0.2s}
        .pl-mc:hover{border-color:rgba(255,255,255,0.25);color:#fff}
        .pl-md{flex:1;padding:12px;background:linear-gradient(135deg,#ff5050,#cc2020);border:none;border-radius:10px;color:#fff;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s}
        .pl-md:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(255,80,80,0.4)}
        @media(max-width:768px){.pl-stats{grid-template-columns:repeat(2,1fr)}.pl-thead,.pl-row{grid-template-columns:2fr 1fr 1fr}}
      `}</style>
      <div className="pl-root">
        <div className="pl-bg" />
        <div className="pl-orb1" />
        <div className="pl-orb2" />
        <div className="pl-layout">
          <nav className="pl-nav">
            <div className="pl-brand">
              <div className="pl-dot" />
              <span className="pl-brand-text">Admin Panel</span>
            </div>
            <Link to="/admin/products/add" className="pl-add-btn">
              ＋ Add Product
            </Link>
          </nav>
          <div className="pl-header">
            <div className="pl-tag">Inventory Management</div>
            <h1 className="pl-h1">
              Product <span>Catalogue</span>
            </h1>
          </div>
          <div className="pl-stats">
            {[
              {
                lbl: "Total Products",
                v: products.length,
                sub: "in catalogue",
                c: "#00d4ff",
              },
              {
                lbl: "Total Value",
                v: `₹${totalValue.toLocaleString("en-IN")}`,
                sub: "combined price",
                c: "#00ff80",
              },
              {
                lbl: "Low Stock",
                v: lowStock,
                sub: "items ≤ 5 units",
                c: "#ff5050",
              },
              { lbl: "Categories", v: categories, sub: "unique", c: "#ffb400" },
            ].map((s) => (
              <div key={s.lbl} className="pl-stat">
                <div
                  className="pl-stat-stripe"
                  style={{
                    background: `linear-gradient(90deg,${s.c},transparent)`,
                  }}
                />
                <div className="pl-stat-lbl">{s.lbl}</div>
                <div className="pl-stat-v">{s.v}</div>
                <div className="pl-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="pl-controls">
            <div className="pl-sw">
              <span className="pl-sico">⌕</span>
              <input
                className="pl-search"
                placeholder="Search by title or category…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="pl-badge">{filtered.length} items</div>
          </div>
          <div className="pl-card">
            <div className="pl-thead">
              <span className="pl-th">Product</span>
              <span className="pl-th">Price</span>
              <span className="pl-th">Category</span>
              <span className="pl-th c">Stock</span>
              <span className="pl-th r">Actions</span>
            </div>
            {loading ? (
              <div className="pl-skel">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="pl-skel-row">
                    <div
                      className="pl-skel-b"
                      style={{ width: "35%", animationDelay: `${i * 0.1}s` }}
                    />
                    <div
                      className="pl-skel-b"
                      style={{ width: "12%", animationDelay: `${i * 0.15}s` }}
                    />
                    <div
                      className="pl-skel-b"
                      style={{ width: "16%", animationDelay: `${i * 0.2}s` }}
                    />
                    <div
                      className="pl-skel-b"
                      style={{ width: "7%", animationDelay: `${i * 0.25}s` }}
                    />
                    <div
                      className="pl-skel-b"
                      style={{
                        width: "16%",
                        marginLeft: "auto",
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="pl-empty">
                <div className="pl-empty-ico">📦</div>
                <div className="pl-empty-txt">
                  {search
                    ? "No products match your search"
                    : "No products yet — add your first one!"}
                </div>
              </div>
            ) : (
              filtered.map((p, i) => (
                <div
                  key={p._id}
                  className="pl-row"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div>
                    <div className="pl-pname">{p.title}</div>
                    <div className="pl-pid">
                      #{p._id?.slice(-6)?.toUpperCase()}
                    </div>
                  </div>
                  <div className="pl-price">₹{p.price?.toFixed(2)}</div>
                  <div>
                    <span className="pl-cat">{p.category}</span>
                  </div>
                  <div
                    className={`pl-stock ${p.stock <= 5 ? "low" : p.stock <= 20 ? "mid" : "ok"}`}
                  >
                    {p.stock}
                  </div>
                  <div className="pl-acts">
                    <Link
                      to={`/admin/products/edit/${p._id}`}
                      className="pl-edit"
                    >
                      Edit
                    </Link>
                    <button
                      className="pl-del"
                      onClick={() => setDeleteId(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {deleteId && (
        <div className="pl-overlay" onClick={() => setDeleteId(null)}>
          <div className="pl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pl-modal-ico">🗑</div>
            <h3>Delete Product?</h3>
            <p>
              This action is permanent and cannot be undone. The product will be
              removed from your catalogue immediately.
            </p>
            <div className="pl-modal-btns">
              <button className="pl-mc" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="pl-md" onClick={deleteProduct}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
