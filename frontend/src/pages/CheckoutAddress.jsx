import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router";

const FIELDS = [
  { name: "fullName",    label: "Full Name",       type: "text",   placeholder: "e.g. Rahul Sharma",       icon: "👤", span: 2 },
  { name: "phone",       label: "Phone Number",    type: "tel",    placeholder: "e.g. 9876543210",         icon: "📞", span: 1 },
  { name: "pin",         label: "PIN Code",        type: "text",   placeholder: "e.g. 400001",             icon: "📮", span: 1 },
  { name: "addressLine", label: "Address Line",    type: "text",   placeholder: "House no., Street, Area", icon: "🏠", span: 2 },
  { name: "city",        label: "City",            type: "text",   placeholder: "e.g. Mumbai",             icon: "🌆", span: 1 },
  { name: "State",       label: "State",           type: "text",   placeholder: "e.g. Maharashtra",        icon: "🗺", span: 1 },
];

export default function CheckoutAddress() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "", phone: "", addressLine: "",
    city: "", State: "", pin: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // clear individual field error on change
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())    e.fullName    = "Full name is required";
    if (!form.phone.trim())       e.phone       = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = "Enter a valid 10-digit number";
    if (!form.addressLine.trim()) e.addressLine = "Address is required";
    if (!form.city.trim())        e.city        = "City is required";
    if (!form.State.trim())       e.State       = "State is required";
    if (!form.pin.trim())         e.pin         = "PIN code is required";
    else if (!/^\d{6}$/.test(form.pin.trim())) e.pin = "Enter a valid 6-digit PIN";
    return e;
  };

  const saveAddress = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
      // BUG 1 FIX: await the API call before navigating
      await api.post("/address/add", { ...form, userId });
      setMsg({ text: "Address saved! Redirecting…", type: "success" });
      setTimeout(() => navigate("/checkout"), 1000);
    } catch (error) {
      console.error("Error saving address:", error);
      setMsg({ text: "Failed to save address. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .ca-root{min-height:100vh;font-family:'DM Sans',sans-serif;background:#0b0f1a;position:relative;overflow-x:hidden;}
        .ca-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background:linear-gradient(160deg,#0b0f1a 0%,#0d1627 55%,#0b0f1a 100%);}
        .ca-bg::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);background-size:48px 48px;animation:ca-grid 24s linear infinite;}
        @keyframes ca-grid{0%{background-position:0 0}100%{background-position:0 48px}}
        .ca-orb1{position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(0,212,255,0.06) 0%,transparent 70%);top:-100px;right:-80px;animation:ca-float 10s ease-in-out infinite alternate;pointer-events:none;z-index:0;}
        .ca-orb2{position:fixed;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(120,80,255,0.04) 0%,transparent 70%);bottom:-80px;left:-80px;animation:ca-float 13s ease-in-out infinite alternate-reverse;pointer-events:none;z-index:0;}
        @keyframes ca-float{from{transform:scale(1)}to{transform:scale(1.15) translate(15px,-15px)}}

        .ca-layout{position:relative;z-index:1;max-width:700px;margin:0 auto;padding:40px 24px 80px;}

        /* Progress steps */
        .ca-steps{display:flex;align-items:center;margin-bottom:40px;animation:ca-rise 0.5s cubic-bezier(0.16,1,0.3,1) both;}
        @keyframes ca-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .ca-step{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:500;}
        .ca-step-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;flex-shrink:0;}
        .ca-step.done .ca-step-num{background:rgba(0,212,255,0.15);border:1px solid rgba(0,212,255,0.4);color:#00d4ff;}
        .ca-step.active .ca-step-num{background:linear-gradient(135deg,#00d4ff,#0099cc);color:#0b0f1a;box-shadow:0 0 14px rgba(0,212,255,0.35);}
        .ca-step.pending .ca-step-num{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.25);}
        .ca-step.done .ca-step-label{color:rgba(0,212,255,0.7);}
        .ca-step.active .ca-step-label{color:#fff;font-weight:600;}
        .ca-step.pending .ca-step-label{color:rgba(255,255,255,0.25);}
        .ca-step-label{font-size:12px;letter-spacing:0.3px;}
        .ca-step-line{flex:1;height:1px;margin:0 12px;}
        .ca-step-line.done{background:rgba(0,212,255,0.3);}
        .ca-step-line.pending{background:rgba(255,255,255,0.06);}

        /* Header */
        .ca-header{margin-bottom:28px;animation:ca-rise 0.6s 0.05s cubic-bezier(0.16,1,0.3,1) both;}
        .ca-tag{font-size:11px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:#00d4ff;margin-bottom:10px;display:flex;align-items:center;gap:8px;}
        .ca-tag::before{content:'';width:20px;height:1px;background:#00d4ff;}
        .ca-h1{font-family:'Syne',sans-serif;font-size:clamp(26px,4vw,38px);font-weight:700;color:#fff;letter-spacing:-0.5px;}
        .ca-h1 span{color:#00d4ff;}
        .ca-sub{font-size:13px;color:rgba(255,255,255,0.3);margin-top:6px;font-weight:300;}

        /* Alert */
        .ca-alert{padding:13px 16px;border-radius:10px;font-size:13px;margin-bottom:20px;display:flex;align-items:center;gap:10px;animation:ca-rise 0.3s ease both;}
        .ca-alert.success{background:rgba(0,255,128,0.08);border:1px solid rgba(0,255,128,0.25);color:#00ff80;}
        .ca-alert.error{background:rgba(255,80,80,0.08);border:1px solid rgba(255,80,80,0.25);color:#ff5050;}

        /* Card */
        .ca-card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:22px;overflow:hidden;animation:ca-rise 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both;box-shadow:0 32px 64px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.05);}
        .ca-card-head{padding:20px 28px;border-bottom:1px solid rgba(255,255,255,0.05);background:rgba(0,212,255,0.025);display:flex;align-items:center;gap:14px;}
        .ca-card-icon{width:40px;height:40px;background:linear-gradient(135deg,rgba(0,212,255,0.2),rgba(0,212,255,0.05));border:1px solid rgba(0,212,255,0.3);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
        .ca-card-meta h3{font-family:'Syne',sans-serif;font-size:15px;font-weight:600;color:#fff;}
        .ca-card-meta p{font-size:12px;color:rgba(255,255,255,0.3);margin-top:2px;}

        /* Form grid */
        .ca-body{padding:28px;}
        .ca-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
        .ca-full{grid-column:1/-1;}
        .ca-field label{display:block;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:rgba(0,212,255,0.6);margin-bottom:7px;}
        .ca-iw{position:relative;}
        .ca-ico{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:14px;pointer-events:none;line-height:1;}
        .ca-in{width:100%;padding:12px 16px 12px 40px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;outline:none;transition:all 0.25s;}
        .ca-in::placeholder{color:rgba(255,255,255,0.18);}
        .ca-in:focus{border-color:rgba(0,212,255,0.45);background:rgba(0,212,255,0.05);box-shadow:0 0 0 3px rgba(0,212,255,0.07);}
        .ca-in.err{border-color:rgba(255,80,80,0.4);background:rgba(255,80,80,0.04);}
        .ca-err{font-size:11px;color:#ff5050;margin-top:5px;display:flex;align-items:center;gap:4px;}

        /* Footer */
        .ca-footer{display:flex;gap:12px;padding:20px 28px;border-top:1px solid rgba(255,255,255,0.05);background:rgba(0,0,0,0.1);}
        .ca-submit{flex:1;padding:14px;background:linear-gradient(135deg,#00d4ff,#0099cc);border:none;border-radius:10px;color:#0b0f1a;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;letter-spacing:0.5px;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden;}
        .ca-submit::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,0);transition:background 0.25s;}
        .ca-submit:hover:not(:disabled)::after{background:rgba(255,255,255,0.12);}
        .ca-submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 10px 28px rgba(0,212,255,0.38);}
        .ca-submit:disabled{opacity:0.5;cursor:not-allowed;}
        .ca-back{padding:14px 22px;background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:rgba(255,255,255,0.4);font-family:'DM Sans',sans-serif;font-size:14px;text-decoration:none;display:flex;align-items:center;transition:all 0.2s;}
        .ca-back:hover{border-color:rgba(255,255,255,0.25);color:rgba(255,255,255,0.75);}
        .ca-spin{display:inline-block;width:15px;height:15px;border:2px solid rgba(11,15,26,0.25);border-top-color:#0b0f1a;border-radius:50%;animation:ca-s 0.7s linear infinite;vertical-align:middle;margin-right:8px;}
        @keyframes ca-s{to{transform:rotate(360deg)}}

        /* Security note */
        .ca-secure{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:16px;font-size:11px;color:rgba(255,255,255,0.2);}
        .ca-secure svg{width:12px;height:12px;}

        @media(max-width:540px){.ca-grid{grid-template-columns:1fr;}.ca-footer{flex-direction:column;}.ca-back{justify-content:center;}}
      `}</style>

      <div className="ca-root">
        <div className="ca-bg"/><div className="ca-orb1"/><div className="ca-orb2"/>
        <div className="ca-layout">

          {/* Progress steps */}
          <div className="ca-steps">
            {[
              { num: "1", label: "Cart",    state: "done" },
              { num: "2", label: "Address", state: "active" },
              { num: "3", label: "Review",  state: "pending" },
            ].map((s, i, arr) => (
              <div key={s.num} style={{display:"flex",alignItems:"center",flex: i < arr.length - 1 ? 1 : 0}}>
                <div className={`ca-step ${s.state}`}>
                  <div className="ca-step-num">
                    {s.state === "done" ? "✓" : s.num}
                  </div>
                  <span className="ca-step-label">{s.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className={`ca-step-line ${s.state === "done" ? "done" : "pending"}`} style={{flex:1}}/>
                )}
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="ca-header">
            <div className="ca-tag">Step 2 of 3</div>
            <h1 className="ca-h1">Delivery <span>Address</span></h1>
            {/* BUG 2 FIX: was "mxauto" — now proper className */}
            <p className="ca-sub">Enter where you'd like your order delivered</p>
          </div>

          {msg.text && (
            <div className={`ca-alert ${msg.type}`}>
              {msg.type === "success" ? "✓" : "!"} {msg.text}
            </div>
          )}

          <div className="ca-card">
            <div className="ca-card-head">
              <div className="ca-card-icon">📍</div>
              <div className="ca-card-meta">
                <h3>Shipping Information</h3>
                <p>All fields marked with * are required</p>
              </div>
            </div>

            <div className="ca-body">
              <div className="ca-grid">
                {FIELDS.map((f) => (
                  <div key={f.name} className={`ca-field ${f.span === 2 ? "ca-full" : ""}`}>
                    <label>{f.label} *</label>
                    <div className="ca-iw">
                      <span className="ca-ico">{f.icon}</span>
                      {/* BUG 3 FIX: added value={form[f.name]} to make inputs controlled */}
                      <input
                        name={f.name}
                        type={f.type}
                        placeholder={f.placeholder}
                        value={form[f.name]}
                        onChange={handleChange}
                        className={`ca-in ${errors[f.name] ? "err" : ""}`}
                      />
                    </div>
                    {errors[f.name] && (
                      <div className="ca-err">! {errors[f.name]}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="ca-footer">
              <Link to="/cart" className="ca-back">← Back</Link>
              <button className="ca-submit" onClick={saveAddress} disabled={loading}>
                {loading && <span className="ca-spin"/>}
                {loading ? "Saving…" : "Save & Continue →"}
              </button>
            </div>
          </div>

          <div className="ca-secure">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Your information is encrypted and secure
          </div>
        </div>
      </div>
    </>
  );
}