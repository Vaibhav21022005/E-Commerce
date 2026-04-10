import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams, Link } from "react-router";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const loadProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const p = res.data.product;
      setForm({
        title: p.title || "",
        description: p.description || "",
        price: p.price || "",
        category: p.category || "",
        stock: p.stock || "",
        images: Array.isArray(p.images) ? p.images.join(", ") : p.images || "",
      });
    } catch (error) {
      console.error("Error loading product:", error);
      setMsg({ text: "Failed to load product data.", type: "error" });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        images: form.images
          ? form.images
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };
      await api.put(`/products/update/${id}`, payload);
      setMsg({ text: "Product updated successfully!", type: "success" });
      setTimeout(() => navigate("/admin/products"), 1200);
    } catch (error) {
      setMsg({
        text: error.response?.data?.message || "Failed to update product.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .ep-root{min-height:100vh;font-family:'DM Sans',sans-serif;background:#0b0f1a;position:relative;overflow-x:hidden}
        .ep-bg{position:fixed;inset:0;z-index:0;background:linear-gradient(160deg,#0b0f1a 0%,#0d1627 55%,#0b0f1a 100%)}
        .ep-bg::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px);background-size:48px 48px;animation:ep-grid 22s linear infinite}
        @keyframes ep-grid{0%{background-position:0 0}100%{background-position:0 48px}}
        .ep-orb1{position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(255,160,0,0.05) 0%,transparent 70%);top:-150px;right:-100px;animation:ep-float 9s ease-in-out infinite alternate;pointer-events:none;z-index:0}
        .ep-orb2{position:fixed;width:350px;height:350px;border-radius:50%;background:radial-gradient(circle,rgba(0,212,255,0.05) 0%,transparent 70%);bottom:-80px;left:-80px;animation:ep-float 12s ease-in-out infinite alternate-reverse;pointer-events:none;z-index:0}
        @keyframes ep-float{from{transform:translate(0,0) scale(1)}to{transform:translate(30px,-30px) scale(1.1)}}
        .ep-layout{position:relative;z-index:1;max-width:920px;margin:0 auto;padding:32px 24px 60px}
        .ep-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;padding-bottom:20px;border-bottom:1px solid rgba(0,212,255,0.1)}
        .ep-brand{display:flex;align-items:center;gap:10px}
        .ep-dot{width:8px;height:8px;border-radius:50%;background:#ffb400;box-shadow:0 0 12px rgba(255,180,0,0.9);animation:ep-pulse 2s ease-in-out infinite}
        @keyframes ep-pulse{0%,100%{box-shadow:0 0 8px rgba(255,180,0,0.8)}50%{box-shadow:0 0 22px rgba(255,180,0,1)}}
        .ep-brand-text{font-family:'Syne',sans-serif;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.35)}
        .ep-back{display:flex;align-items:center;gap:7px;font-size:13px;color:rgba(0,212,255,0.7);text-decoration:none;padding:8px 16px;border:1px solid rgba(0,212,255,0.2);border-radius:8px;transition:all 0.2s;background:rgba(0,212,255,0.03)}
        .ep-back:hover{color:#00d4ff;border-color:rgba(0,212,255,0.5);background:rgba(0,212,255,0.08);transform:translateX(-2px)}
        .ep-header{margin-bottom:32px;animation:ep-rise 0.6s cubic-bezier(0.16,1,0.3,1) both}
        @keyframes ep-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .ep-tag{font-size:11px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:#ffb400;margin-bottom:10px;display:flex;align-items:center;gap:8px}
        .ep-tag::before{content:'';width:20px;height:1px;background:#ffb400}
        .ep-h1{font-family:'Syne',sans-serif;font-size:clamp(28px,4vw,44px);font-weight:700;color:#fff;letter-spacing:-0.5px;line-height:1.1}
        .ep-h1 span{color:#ffb400}
        .ep-id-badge{display:inline-flex;align-items:center;gap:8px;margin-top:10px;padding:6px 14px;background:rgba(255,180,0,0.08);border:1px solid rgba(255,180,0,0.2);border-radius:8px;font-size:12px;color:rgba(255,180,0,0.7);font-family:'DM Sans',sans-serif}
        .ep-alert{padding:14px 18px;border-radius:10px;font-size:13px;margin-bottom:20px;display:flex;align-items:center;gap:10px;animation:ep-rise 0.3s ease both}
        .ep-alert.success{background:rgba(0,255,128,0.08);border:1px solid rgba(0,255,128,0.25);color:#00ff80}
        .ep-alert.error{background:rgba(255,80,80,0.08);border:1px solid rgba(255,80,80,0.25);color:#ff5050}
        .ep-card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:22px;overflow:hidden;animation:ep-rise 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both;box-shadow:0 32px 64px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.05)}
        .ep-card-top{padding:22px 28px;border-bottom:1px solid rgba(255,255,255,0.05);background:rgba(255,180,0,0.02);display:flex;align-items:center;gap:14px}
        .ep-card-icon{width:42px;height:42px;background:linear-gradient(135deg,rgba(255,180,0,0.2),rgba(255,180,0,0.05));border:1px solid rgba(255,180,0,0.3);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:19px;color:#ffb400;flex-shrink:0}
        .ep-card-meta h3{font-family:'Syne',sans-serif;font-size:15px;font-weight:600;color:#fff}
        .ep-card-meta p{font-size:12px;color:rgba(255,255,255,0.3);margin-top:2px}
        .ep-body{padding:28px}
        .ep-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .ep-full{grid-column:1/-1}
        .ep-field label{display:block;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,180,0,0.65);margin-bottom:8px}
        .ep-iw{position:relative}
        .ep-ico{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:12px;font-weight:600;color:rgba(255,180,0,0.4);pointer-events:none;font-family:'Syne',sans-serif}
        .ep-in{width:100%;padding:13px 16px 13px 40px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;outline:none;transition:all 0.25s}
        .ep-in::placeholder{color:rgba(255,255,255,0.2)}
        .ep-in:focus{border-color:rgba(255,180,0,0.45);background:rgba(255,180,0,0.04);box-shadow:0 0 0 3px rgba(255,180,0,0.07)}
        .ep-tw{position:relative}
        .ep-tico{position:absolute;left:14px;top:15px;font-size:12px;font-weight:600;color:rgba(255,180,0,0.4);pointer-events:none;font-family:'Syne',sans-serif}
        .ep-ta{width:100%;padding:13px 16px 13px 40px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;outline:none;resize:vertical;min-height:100px;transition:all 0.25s}
        .ep-ta::placeholder{color:rgba(255,255,255,0.2)}
        .ep-ta:focus{border-color:rgba(255,180,0,0.45);background:rgba(255,180,0,0.04);box-shadow:0 0 0 3px rgba(255,180,0,0.07)}
        /* Fetching skeleton */
        .ep-body.loading .ep-in,.ep-body.loading .ep-ta{background:linear-gradient(90deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.04) 100%);background-size:200% 100%;animation:ep-shim 1.5s infinite;color:transparent;pointer-events:none}
        @keyframes ep-shim{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .ep-footer{display:flex;gap:12px;padding:20px 28px;border-top:1px solid rgba(255,255,255,0.05);background:rgba(0,0,0,0.1)}
        .ep-submit{flex:1;padding:14px;background:linear-gradient(135deg,#ffb400 0%,#cc8800 100%);border:none;border-radius:10px;color:#0b0f1a;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden}
        .ep-submit::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,0);transition:background 0.25s}
        .ep-submit:hover:not(:disabled)::after{background:rgba(255,255,255,0.15)}
        .ep-submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 10px 28px rgba(255,180,0,0.38)}
        .ep-submit:disabled{opacity:0.5;cursor:not-allowed}
        .ep-cancel-btn{padding:14px 24px;background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:rgba(255,255,255,0.4);font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;transition:all 0.2s;text-decoration:none;display:flex;align-items:center}
        .ep-cancel-btn:hover{border-color:rgba(255,255,255,0.25);color:rgba(255,255,255,0.75)}
        .ep-spin{display:inline-block;width:15px;height:15px;border:2px solid rgba(11,15,26,0.3);border-top-color:#0b0f1a;border-radius:50%;animation:ep-s 0.7s linear infinite;vertical-align:middle;margin-right:8px}
        @keyframes ep-s{to{transform:rotate(360deg)}}
        /* Change-indicator: highlights fields that have been modified */
        .ep-changed{border-color:rgba(255,180,0,0.5)!important;background:rgba(255,180,0,0.06)!important}
        @media(max-width:600px){.ep-grid{grid-template-columns:1fr}.ep-footer{flex-direction:column}.ep-cancel-btn{justify-content:center}}
      `}</style>
      <div className="ep-root">
        <div className="ep-bg" />
        <div className="ep-orb1" />
        <div className="ep-orb2" />
        <div className="ep-layout">
          <nav className="ep-nav">
            <div className="ep-brand">
              <div className="ep-dot" />
              <span className="ep-brand-text">Admin Panel</span>
            </div>
            <Link to="/admin/products" className="ep-back">
              ← Products
            </Link>
          </nav>
          <div className="ep-header">
            <div className="ep-tag">Edit Product</div>
            <h1 className="ep-h1">
              Update <span>Product</span>
            </h1>
            {id && (
              <div className="ep-id-badge">
                ✎ Editing ID: #{id.slice(-8).toUpperCase()}
              </div>
            )}
          </div>
          {msg.text && (
            <div className={`ep-alert ${msg.type}`}>
              {msg.type === "success" ? "✓" : "!"} {msg.text}
            </div>
          )}
          <div className="ep-card">
            <div className="ep-card-top">
              <div className="ep-card-icon">✎</div>
              <div className="ep-card-meta">
                <h3>Product Details</h3>
                <p>
                  {fetching
                    ? "Loading product data…"
                    : "Update the fields below and save your changes"}
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={`ep-body${fetching ? " loading" : ""}`}>
                <div className="ep-grid">
                  <div className="ep-field ep-full">
                    <label>Product Title *</label>
                    <div className="ep-iw">
                      <span className="ep-ico">T</span>
                      <input
                        name="title"
                        type="text"
                        placeholder="Product title"
                        value={form.title}
                        onChange={handleChange}
                        className="ep-in"
                        required
                      />
                    </div>
                  </div>
                  <div className="ep-field ep-full">
                    <label>Description</label>
                    <div className="ep-tw">
                      <span className="ep-tico">≡</span>
                      <textarea
                        name="description"
                        placeholder="Product description…"
                        value={form.description}
                        onChange={handleChange}
                        className="ep-ta"
                      />
                    </div>
                  </div>
                  <div className="ep-field">
                    <label>Price (₹) *</label>
                    <div className="ep-iw">
                      <span className="ep-ico">₹</span>
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={form.price}
                        onChange={handleChange}
                        className="ep-in"
                        required
                      />
                    </div>
                  </div>
                  <div className="ep-field">
                    <label>Stock Quantity *</label>
                    <div className="ep-iw">
                      <span className="ep-ico">#</span>
                      <input
                        name="stock"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={form.stock}
                        onChange={handleChange}
                        className="ep-in"
                        required
                      />
                    </div>
                  </div>
                  <div className="ep-field">
                    <label>Category *</label>
                    <div className="ep-iw">
                      <span className="ep-ico">◈</span>
                      <input
                        name="category"
                        type="text"
                        placeholder="e.g. Accessories"
                        value={form.category}
                        onChange={handleChange}
                        className="ep-in"
                        required
                      />
                    </div>
                  </div>
                  <div className="ep-field">
                    <label>Image URLs</label>
                    <div className="ep-iw">
                      <span className="ep-ico">⊞</span>
                      <input
                        name="images"
                        type="text"
                        placeholder="url1, url2 (comma-separated)"
                        value={form.images}
                        onChange={handleChange}
                        className="ep-in"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="ep-footer">
                <Link to="/admin/products" className="ep-cancel-btn">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="ep-submit"
                  disabled={loading || fetching}
                >
                  {loading && <span className="ep-spin" />}
                  {loading ? "Saving Changes…" : "Save Changes →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
