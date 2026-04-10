import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router";

export default function AddProduct() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const navigate = useNavigate();

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
      await api.post("/products/add", payload);
      setMsg({ text: "Product added successfully!", type: "success" });
      setTimeout(() => navigate("/admin/products"), 1200);
    } catch (error) {
      setMsg({
        text: error.response?.data?.message || "Failed to add product.",
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
        .ap-root{min-height:100vh;font-family:'DM Sans',sans-serif;background:#0b0f1a;position:relative;overflow-x:hidden}
        .ap-bg{position:fixed;inset:0;z-index:0;background:linear-gradient(160deg,#0b0f1a 0%,#0d1627 55%,#0b0f1a 100%)}
        .ap-bg::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px);background-size:48px 48px;animation:ap-grid 22s linear infinite}
        @keyframes ap-grid{0%{background-position:0 0}100%{background-position:0 48px}}
        .ap-orb1{position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(0,212,255,0.07) 0%,transparent 70%);top:-150px;right:-100px;animation:ap-float 9s ease-in-out infinite alternate;pointer-events:none;z-index:0}
        .ap-orb2{position:fixed;width:350px;height:350px;border-radius:50%;background:radial-gradient(circle,rgba(120,80,255,0.06) 0%,transparent 70%);bottom:-80px;left:-80px;animation:ap-float 12s ease-in-out infinite alternate-reverse;pointer-events:none;z-index:0}
        @keyframes ap-float{from{transform:translate(0,0) scale(1)}to{transform:translate(30px,-30px) scale(1.1)}}
        .ap-layout{position:relative;z-index:1;max-width:920px;margin:0 auto;padding:32px 24px 60px}
        .ap-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;padding-bottom:20px;border-bottom:1px solid rgba(0,212,255,0.1)}
        .ap-brand{display:flex;align-items:center;gap:10px}
        .ap-dot{width:8px;height:8px;border-radius:50%;background:#00d4ff;box-shadow:0 0 12px rgba(0,212,255,0.9);animation:ap-pulse 2s ease-in-out infinite}
        @keyframes ap-pulse{0%,100%{box-shadow:0 0 8px rgba(0,212,255,0.8)}50%{box-shadow:0 0 22px rgba(0,212,255,1)}}
        .ap-brand-text{font-family:'Syne',sans-serif;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.35)}
        .ap-back{display:flex;align-items:center;gap:7px;font-size:13px;color:rgba(0,212,255,0.7);text-decoration:none;padding:8px 16px;border:1px solid rgba(0,212,255,0.2);border-radius:8px;transition:all 0.2s;background:rgba(0,212,255,0.03)}
        .ap-back:hover{color:#00d4ff;border-color:rgba(0,212,255,0.5);background:rgba(0,212,255,0.08);transform:translateX(-2px)}
        .ap-header{margin-bottom:32px;animation:ap-rise 0.6s cubic-bezier(0.16,1,0.3,1) both}
        @keyframes ap-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .ap-tag{font-size:11px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:#00d4ff;margin-bottom:10px;display:flex;align-items:center;gap:8px}
        .ap-tag::before{content:'';width:20px;height:1px;background:#00d4ff}
        .ap-h1{font-family:'Syne',sans-serif;font-size:clamp(28px,4vw,44px);font-weight:700;color:#fff;letter-spacing:-0.5px;line-height:1.1}
        .ap-h1 span{color:#00d4ff}
        .ap-alert{padding:14px 18px;border-radius:10px;font-size:13px;margin-bottom:20px;display:flex;align-items:center;gap:10px;animation:ap-rise 0.3s ease both}
        .ap-alert.success{background:rgba(0,255,128,0.08);border:1px solid rgba(0,255,128,0.25);color:#00ff80}
        .ap-alert.error{background:rgba(255,80,80,0.08);border:1px solid rgba(255,80,80,0.25);color:#ff5050}
        .ap-card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:22px;overflow:hidden;animation:ap-rise 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both;box-shadow:0 32px 64px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.05)}
        .ap-card-top{padding:22px 28px;border-bottom:1px solid rgba(255,255,255,0.05);background:rgba(0,212,255,0.025);display:flex;align-items:center;gap:14px}
        .ap-card-icon{width:42px;height:42px;background:linear-gradient(135deg,rgba(0,212,255,0.2),rgba(0,212,255,0.05));border:1px solid rgba(0,212,255,0.3);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:20px;color:#00d4ff;flex-shrink:0}
        .ap-card-meta h3{font-family:'Syne',sans-serif;font-size:15px;font-weight:600;color:#fff}
        .ap-card-meta p{font-size:12px;color:rgba(255,255,255,0.3);margin-top:2px}
        .ap-body{padding:28px}
        .ap-tips{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:24px}
        .ap-tip{display:flex;align-items:center;gap:6px;font-size:11px;color:rgba(255,255,255,0.3);background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:6px 12px}
        .ap-tip-dot{width:5px;height:5px;border-radius:50%}
        .ap-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .ap-full{grid-column:1/-1}
        .ap-field label{display:block;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:rgba(0,212,255,0.6);margin-bottom:8px}
        .ap-iw{position:relative}
        .ap-ico{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:12px;font-weight:600;color:rgba(0,212,255,0.4);pointer-events:none;font-family:'Syne',sans-serif}
        .ap-in{width:100%;padding:13px 16px 13px 40px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;outline:none;transition:all 0.25s}
        .ap-in::placeholder{color:rgba(255,255,255,0.2)}
        .ap-in:focus{border-color:rgba(0,212,255,0.45);background:rgba(0,212,255,0.05);box-shadow:0 0 0 3px rgba(0,212,255,0.07)}
        .ap-tw{position:relative}
        .ap-tico{position:absolute;left:14px;top:15px;font-size:12px;font-weight:600;color:rgba(0,212,255,0.4);pointer-events:none;font-family:'Syne',sans-serif}
        .ap-ta{width:100%;padding:13px 16px 13px 40px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;outline:none;resize:vertical;min-height:100px;transition:all 0.25s}
        .ap-ta::placeholder{color:rgba(255,255,255,0.2)}
        .ap-ta:focus{border-color:rgba(0,212,255,0.45);background:rgba(0,212,255,0.05);box-shadow:0 0 0 3px rgba(0,212,255,0.07)}
        .ap-footer{display:flex;gap:12px;padding:20px 28px;border-top:1px solid rgba(255,255,255,0.05);background:rgba(0,0,0,0.1)}
        .ap-submit{flex:1;padding:14px;background:linear-gradient(135deg,#00d4ff 0%,#0099cc 100%);border:none;border-radius:10px;color:#0b0f1a;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden}
        .ap-submit::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,0);transition:background 0.25s}
        .ap-submit:hover:not(:disabled)::after{background:rgba(255,255,255,0.15)}
        .ap-submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 10px 28px rgba(0,212,255,0.4)}
        .ap-submit:disabled{opacity:0.5;cursor:not-allowed}
        .ap-cancel-btn{padding:14px 24px;background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:rgba(255,255,255,0.4);font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;transition:all 0.2s;text-decoration:none;display:flex;align-items:center}
        .ap-cancel-btn:hover{border-color:rgba(255,255,255,0.25);color:rgba(255,255,255,0.75)}
        .ap-spin{display:inline-block;width:15px;height:15px;border:2px solid rgba(11,15,26,0.3);border-top-color:#0b0f1a;border-radius:50%;animation:ap-s 0.7s linear infinite;vertical-align:middle;margin-right:8px}
        @keyframes ap-s{to{transform:rotate(360deg)}}
        @media(max-width:600px){.ap-grid{grid-template-columns:1fr}.ap-footer{flex-direction:column}.ap-cancel-btn{justify-content:center}}
      `}</style>
      <div className="ap-root">
        <div className="ap-bg" />
        <div className="ap-orb1" />
        <div className="ap-orb2" />
        <div className="ap-layout">
          <nav className="ap-nav">
            <div className="ap-brand">
              <div className="ap-dot" />
              <span className="ap-brand-text">Admin Panel</span>
            </div>
            <Link to="/admin/products" className="ap-back">
              ← Products
            </Link>
          </nav>
          <div className="ap-header">
            <div className="ap-tag">Product Management</div>
            <h1 className="ap-h1">
              Add New <span>Product</span>
            </h1>
          </div>
          {msg.text && (
            <div className={`ap-alert ${msg.type}`}>
              {msg.type === "success" ? "✓" : "!"} {msg.text}
            </div>
          )}
          <div className="ap-card">
            <div className="ap-card-top">
              <div className="ap-card-icon">＋</div>
              <div className="ap-card-meta">
                <h3>Product Details</h3>
                <p>Fill in all fields to list a new product in your store</p>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="ap-body">
                <div className="ap-tips">
                  {[
                    { label: "All marked fields required", c: "#ff5050" },
                    { label: "Images: comma-separated URLs", c: "#00d4ff" },
                    { label: "Price in INR (₹)", c: "#00ff80" },
                  ].map((b) => (
                    <div key={b.label} className="ap-tip">
                      <div className="ap-tip-dot" style={{ background: b.c }} />
                      {b.label}
                    </div>
                  ))}
                </div>
                <div className="ap-grid">
                  <div className="ap-field ap-full">
                    <label>Product Title *</label>
                    <div className="ap-iw">
                      <span className="ap-ico">T</span>
                      <input
                        name="title"
                        type="text"
                        placeholder="e.g. Premium Leather Wallet"
                        value={form.title}
                        onChange={handleChange}
                        className="ap-in"
                        required
                      />
                    </div>
                  </div>
                  <div className="ap-field ap-full">
                    <label>Description</label>
                    <div className="ap-tw">
                      <span className="ap-tico">≡</span>
                      <textarea
                        name="description"
                        placeholder="Describe your product in detail…"
                        value={form.description}
                        onChange={handleChange}
                        className="ap-ta"
                      />
                    </div>
                  </div>
                  <div className="ap-field">
                    <label>Price (₹) *</label>
                    <div className="ap-iw">
                      <span className="ap-ico">₹</span>
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={form.price}
                        onChange={handleChange}
                        className="ap-in"
                        required
                      />
                    </div>
                  </div>
                  <div className="ap-field">
                    <label>Stock Quantity *</label>
                    <div className="ap-iw">
                      <span className="ap-ico">#</span>
                      <input
                        name="stock"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={form.stock}
                        onChange={handleChange}
                        className="ap-in"
                        required
                      />
                    </div>
                  </div>
                  <div className="ap-field">
                    <label>Category *</label>
                    <div className="ap-iw">
                      <span className="ap-ico">◈</span>
                      <input
                        name="category"
                        type="text"
                        placeholder="e.g. Accessories"
                        value={form.category}
                        onChange={handleChange}
                        className="ap-in"
                        required
                      />
                    </div>
                  </div>
                  <div className="ap-field">
                    <label>Image URLs</label>
                    <div className="ap-iw">
                      <span className="ap-ico">⊞</span>
                      <input
                        name="images"
                        type="text"
                        placeholder="url1, url2 (comma-separated)"
                        value={form.images}
                        onChange={handleChange}
                        className="ap-in"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="ap-footer">
                <Link to="/admin/products" className="ap-cancel-btn">
                  Cancel
                </Link>
                <button type="submit" className="ap-submit" disabled={loading}>
                  {loading && <span className="ap-spin" />}
                  {loading ? "Adding Product…" : "Add Product →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
