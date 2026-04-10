import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router";

export default function Checkout() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState(null);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" | "razorpay"

  useEffect(() => {
    if (!userId) navigate("/login");
    const fetchData = async () => {
      try {
        const [cartRes, addrRes] = await Promise.all([
          api.get(`/cart/${userId}`),
          api.get(`/address/${userId}`),
        ]);
        setCart(cartRes.data);
        const addrList = addrRes.data.addresses || [];
        setAddresses(addrList);
        if (addrList.length > 0) setSelectedAddr(addrList[0]._id);
      } catch (err) {
        console.error("Error loading checkout data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const subtotal =
    cart?.items?.reduce(
      (sum, i) => sum + (i.productId?.price || 0) * i.quantity,
      0
    ) || 0;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;
  const totalQty = cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  // ── COD FLOW ──────────────────────────────────────────────────────────────
  const placeCODOrder = async (selectedAddressObj) => {
    const res = await api.post("/order/place", {
      userId,
      address: selectedAddressObj,
      paymentMethod: "COD",
      paymentStatus: "Pending",
    });
    const orderId =
      res.data?._id || res.data?.order?._id || res.data?.orderId || "success";
    navigate(`/order-success/${orderId}`);
  };

  // ── RAZORPAY FLOW ──────────────────────────────────────────────────────────
  const placeRazorpayOrder = async (selectedAddressObj) => {
    // Step 1: create razorpay order from backend
    const { data: rzpOrder } = await api.post("/payment/create-order", {
      amount: total,
    });

    // Step 2: open razorpay popup
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: rzpOrder.amount,
      currency: "INR",
      name: "My Store",
      description: "Order Payment",
      order_id: rzpOrder.id,

      handler: async (response) => {
        try {
          // Step 3: verify signature on backend
          const verifyRes = await api.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            // Step 4: save order in DB
            const orderRes = await api.post("/order/place", {
              userId,
              address: selectedAddressObj,
              paymentMethod: "Razorpay",
              paymentStatus: "Paid",
              paymentId: response.razorpay_payment_id,
            });
            const orderId =
              orderRes.data?._id ||
              orderRes.data?.order?._id ||
              orderRes.data?.orderId ||
              "success";
            navigate(`/order-success/${orderId}`);
          } else {
            setMsg({ text: "Payment verification failed.", type: "error" });
            setPlacing(false);
          }
        } catch (err) {
          setMsg({ text: "Error confirming payment.", type: "error" });
          setPlacing(false);
        }
      },

      prefill: {
        name: selectedAddressObj?.fullName,
        contact: selectedAddressObj?.phone,
      },
      theme: { color: "#00d4ff" },
      modal: {
        ondismiss: () => {
          setMsg({ text: "Payment cancelled.", type: "error" });
          setPlacing(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ── MAIN HANDLER ───────────────────────────────────────────────────────────
  const placeOrder = async () => {
    if (!selectedAddr) {
      setMsg({ text: "Please select a delivery address.", type: "error" });
      return;
    }
    setPlacing(true);
    setMsg({ text: "", type: "" });

    const selectedAddressObj = addresses.find((a) => a._id === selectedAddr);

    try {
      if (paymentMethod === "cod") {
        await placeCODOrder(selectedAddressObj);
      } else {
        await placeRazorpayOrder(selectedAddressObj);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMsg({ text: "Failed to place order. Please try again.", type: "error" });
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          .ck-root{min-height:100vh;font-family:'DM Sans',sans-serif;background:#0b0f1a;display:flex;align-items:center;justify-content:center;}
          .ck-spin{width:40px;height:40px;border:3px solid rgba(0,212,255,0.15);border-top-color:#00d4ff;border-radius:50%;animation:ck-s 0.8s linear infinite;}
          @keyframes ck-s{to{transform:rotate(360deg)}}
        `}</style>
        <div className="ck-root"><div className="ck-spin" /></div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .ck-root{min-height:100vh;font-family:'DM Sans',sans-serif;background:#0b0f1a;position:relative;overflow-x:hidden;}
        .ck-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background:linear-gradient(160deg,#0b0f1a 0%,#0d1627 55%,#0b0f1a 100%);}
        .ck-bg::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);background-size:48px 48px;animation:ck-grid 24s linear infinite;}
        @keyframes ck-grid{0%{background-position:0 0}100%{background-position:0 48px}}
        .ck-orb1{position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(0,212,255,0.06) 0%,transparent 70%);top:-100px;right:-80px;animation:ck-float 10s ease-in-out infinite alternate;pointer-events:none;z-index:0;}
        .ck-orb2{position:fixed;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(120,80,255,0.04) 0%,transparent 70%);bottom:-80px;left:-80px;animation:ck-float 13s ease-in-out infinite alternate-reverse;pointer-events:none;z-index:0;}
        @keyframes ck-float{from{transform:scale(1)}to{transform:scale(1.15)}}
        @keyframes ck-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .ck-layout{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:40px 24px 80px;}
        .ck-steps{display:flex;align-items:center;margin-bottom:40px;animation:ck-rise 0.5s cubic-bezier(0.16,1,0.3,1) both;}
        .ck-step{display:flex;align-items:center;gap:8px;}
        .ck-step-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;flex-shrink:0;}
        .ck-step.done .ck-step-num{background:rgba(0,212,255,0.15);border:1px solid rgba(0,212,255,0.4);color:#00d4ff;}
        .ck-step.active .ck-step-num{background:linear-gradient(135deg,#00d4ff,#0099cc);color:#0b0f1a;box-shadow:0 0 14px rgba(0,212,255,0.35);}
        .ck-step.pending .ck-step-num{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.25);}
        .ck-step.done .ck-step-label,.ck-step.active .ck-step-label{color:rgba(255,255,255,0.7);}
        .ck-step.active .ck-step-label{color:#fff;font-weight:600;}
        .ck-step.pending .ck-step-label{color:rgba(255,255,255,0.25);}
        .ck-step-label{font-size:12px;}
        .ck-step-line{flex:1;height:1px;margin:0 12px;}
        .ck-step-line.done{background:rgba(0,212,255,0.3);}
        .ck-step-line.pending{background:rgba(255,255,255,0.06);}
        .ck-header{margin-bottom:28px;animation:ck-rise 0.6s 0.05s cubic-bezier(0.16,1,0.3,1) both;}
        .ck-tag{font-size:11px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:#00d4ff;margin-bottom:10px;display:flex;align-items:center;gap:8px;}
        .ck-tag::before{content:'';width:20px;height:1px;background:#00d4ff;}
        .ck-h1{font-family:'Syne',sans-serif;font-size:clamp(26px,4vw,38px);font-weight:700;color:#fff;letter-spacing:-0.5px;}
        .ck-h1 span{color:#00d4ff;}
        .ck-alert{padding:13px 16px;border-radius:10px;font-size:13px;margin-bottom:20px;display:flex;align-items:center;gap:10px;animation:ck-rise 0.3s ease both;}
        .ck-alert.success{background:rgba(0,255,128,0.08);border:1px solid rgba(0,255,128,0.25);color:#00ff80;}
        .ck-alert.error{background:rgba(255,80,80,0.08);border:1px solid rgba(255,80,80,0.25);color:#ff5050;}
        .ck-grid{display:grid;grid-template-columns:1fr 360px;gap:24px;align-items:start;}
        .ck-card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:18px;overflow:hidden;margin-bottom:20px;animation:ck-rise 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both;}
        .ck-card:last-child{margin-bottom:0;}
        .ck-card-head{padding:16px 22px;border-bottom:1px solid rgba(255,255,255,0.05);background:rgba(0,212,255,0.02);display:flex;align-items:center;justify-content:space-between;}
        .ck-card-head h3{font-family:'Syne',sans-serif;font-size:14px;font-weight:600;color:#fff;display:flex;align-items:center;gap:8px;}
        .ck-card-head-icon{font-size:16px;}
        .ck-add-link{font-size:12px;color:rgba(0,212,255,0.7);text-decoration:none;transition:color 0.2s;}
        .ck-add-link:hover{color:#00d4ff;}
        .ck-addr-list{padding:16px;display:flex;flex-direction:column;gap:10px;}
        .ck-addr{padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.07);cursor:pointer;transition:all 0.2s;position:relative;background:rgba(255,255,255,0.02);}
        .ck-addr:hover{border-color:rgba(0,212,255,0.25);background:rgba(0,212,255,0.03);}
        .ck-addr.selected{border-color:rgba(0,212,255,0.5);background:rgba(0,212,255,0.07);box-shadow:0 0 0 2px rgba(0,212,255,0.1);}
        .ck-addr-radio{position:absolute;top:14px;right:14px;width:18px;height:18px;border-radius:50%;border:2px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
        .ck-addr.selected .ck-addr-radio{border-color:#00d4ff;background:rgba(0,212,255,0.15);}
        .ck-addr-radio-dot{width:8px;height:8px;border-radius:50%;background:#00d4ff;opacity:0;transition:opacity 0.2s;}
        .ck-addr.selected .ck-addr-radio-dot{opacity:1;}
        .ck-addr-name{font-family:'Syne',sans-serif;font-size:14px;font-weight:600;color:#fff;margin-bottom:4px;}
        .ck-addr-phone{font-size:12px;color:rgba(0,212,255,0.6);margin-bottom:6px;}
        .ck-addr-line{font-size:13px;color:rgba(255,255,255,0.4);font-weight:300;line-height:1.5;}
        .ck-no-addr{padding:24px;text-align:center;font-size:13px;color:rgba(255,255,255,0.25);}
        .ck-items{padding:12px 16px;display:flex;flex-direction:column;gap:10px;}
        .ck-item{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);}
        .ck-item:last-child{border-bottom:none;}
        .ck-item-img{width:52px;height:52px;border-radius:8px;object-fit:cover;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);flex-shrink:0;}
        .ck-item-placeholder{width:52px;height:52px;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
        .ck-item-info{flex:1;min-width:0;}
        .ck-item-name{font-size:13px;font-weight:500;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .ck-item-qty{font-size:11px;color:rgba(255,255,255,0.3);margin-top:2px;}
        .ck-item-price{font-family:'Syne',sans-serif;font-size:14px;font-weight:600;color:#00d4ff;flex-shrink:0;}
        .ck-summary{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:18px;overflow:hidden;position:sticky;top:84px;animation:ck-rise 0.6s 0.15s cubic-bezier(0.16,1,0.3,1) both;box-shadow:0 20px 50px rgba(0,0,0,0.3);}
        .ck-sum-head{padding:18px 22px;border-bottom:1px solid rgba(255,255,255,0.05);background:rgba(0,212,255,0.025);}
        .ck-sum-head h3{font-family:'Syne',sans-serif;font-size:15px;font-weight:600;color:#fff;}
        .ck-sum-body{padding:20px 22px;}
        .ck-sum-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font-size:13px;}
        .ck-sum-label{color:rgba(255,255,255,0.38);}
        .ck-sum-val{color:rgba(255,255,255,0.65);font-weight:500;}
        .ck-sum-val.free{color:#00ff80;}
        .ck-divider{height:1px;background:rgba(255,255,255,0.06);margin:14px 0;}
        .ck-sum-total{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;}
        .ck-sum-total-label{font-family:'Syne',sans-serif;font-size:14px;font-weight:600;color:#fff;}
        .ck-sum-total-val{font-family:'Syne',sans-serif;font-size:24px;font-weight:700;color:#00d4ff;}
        /* Payment selector */
        .ck-pay-label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:10px;}
        .ck-pay-options{display:flex;gap:10px;margin-bottom:16px;}
        .ck-pay-opt{flex:1;padding:12px 8px;border-radius:10px;cursor:pointer;text-align:center;transition:all 0.2s;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02);}
        .ck-pay-opt:hover{background:rgba(255,255,255,0.04);}
        .ck-pay-opt.cod-active{border-color:rgba(255,180,0,0.5);background:rgba(255,180,0,0.08);}
        .ck-pay-opt.rzp-active{border-color:rgba(0,212,255,0.5);background:rgba(0,212,255,0.08);}
        .ck-pay-icon{font-size:20px;margin-bottom:4px;}
        .ck-pay-name{font-size:11px;font-weight:600;color:rgba(255,255,255,0.35);}
        .ck-pay-opt.cod-active .ck-pay-name{color:rgba(255,180,0,0.9);}
        .ck-pay-opt.rzp-active .ck-pay-name{color:#00d4ff;}
        /* Button */
        .ck-place-btn{width:100%;padding:15px;background:linear-gradient(135deg,#00d4ff,#0099cc);border:none;border-radius:11px;color:#0b0f1a;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;letter-spacing:0.5px;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden;}
        .ck-place-btn::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,0);transition:background 0.25s;}
        .ck-place-btn:hover:not(:disabled)::after{background:rgba(255,255,255,0.12);}
        .ck-place-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 10px 28px rgba(0,212,255,0.4);}
        .ck-place-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .ck-sum-foot{padding:12px 22px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;font-size:11px;color:rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;gap:6px;}
        .ck-sum-foot svg{width:11px;height:11px;}
        .ck-spin{display:inline-block;width:16px;height:16px;border:2px solid rgba(11,15,26,0.25);border-top-color:#0b0f1a;border-radius:50%;animation:ck-s 0.7s linear infinite;vertical-align:middle;margin-right:8px;}
        @keyframes ck-s{to{transform:rotate(360deg)}}
        @media(max-width:768px){.ck-grid{grid-template-columns:1fr;}.ck-summary{position:static;}}
      `}</style>

      <div className="ck-root">
        <div className="ck-bg" />
        <div className="ck-orb1" />
        <div className="ck-orb2" />
        <div className="ck-layout">

          {/* Progress Steps */}
          <div className="ck-steps">
            {[
              { num: "1", label: "Cart",    state: "done"   },
              { num: "2", label: "Address", state: "done"   },
              { num: "3", label: "Review",  state: "active" },
            ].map((s, i, arr) => (
              <div key={s.num} style={{ display:"flex", alignItems:"center", flex: i < arr.length - 1 ? 1 : 0 }}>
                <div className={`ck-step ${s.state}`}>
                  <div className="ck-step-num">{s.state === "done" ? "✓" : s.num}</div>
                  <span className="ck-step-label">{s.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className={`ck-step-line ${s.state === "done" ? "done" : "pending"}`} style={{ flex: 1 }} />
                )}
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="ck-header">
            <div className="ck-tag">Step 3 of 3</div>
            <h1 className="ck-h1">Order <span>Review</span></h1>
          </div>

          {msg.text && (
            <div className={`ck-alert ${msg.type}`}>
              {msg.type === "success" ? "✓" : "!"} {msg.text}
            </div>
          )}

          <div className="ck-grid">
            {/* Left column */}
            <div>
              {/* Addresses */}
              <div className="ck-card">
                <div className="ck-card-head">
                  <h3><span className="ck-card-head-icon">📍</span> Delivery Address</h3>
                  <Link to="/checkout-address" className="ck-add-link">+ Add New</Link>
                </div>
                {addresses.length === 0 ? (
                  <div className="ck-no-addr">
                    No addresses found.{" "}
                    <Link to="/checkout-address" style={{ color:"#00d4ff", textDecoration:"none" }}>
                      Add one →
                    </Link>
                  </div>
                ) : (
                  <div className="ck-addr-list">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`ck-addr ${selectedAddr === addr._id ? "selected" : ""}`}
                        onClick={() => setSelectedAddr(addr._id)}
                      >
                        <div className="ck-addr-radio"><div className="ck-addr-radio-dot" /></div>
                        <div className="ck-addr-name">{addr.fullName}</div>
                        <div className="ck-addr-phone">{addr.phone}</div>
                        <div className="ck-addr-line">
                          {addr.addressLine}, {addr.city}, {addr.State} — {addr.pin}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Items */}
              <div className="ck-card">
                <div className="ck-card-head">
                  <h3><span className="ck-card-head-icon">🛒</span> Items ({totalQty})</h3>
                  <Link to="/cart" className="ck-add-link">Edit Cart</Link>
                </div>
                <div className="ck-items">
                  {cart?.items?.map((item) => {
                    const p = item.productId;
                    return (
                      <div key={p?._id} className="ck-item">
                        {p?.images?.[0] ? (
                          <img src={p.images[0]} alt={p.title} className="ck-item-img" />
                        ) : (
                          <div className="ck-item-placeholder">📦</div>
                        )}
                        <div className="ck-item-info">
                          <div className="ck-item-name">{p?.title}</div>
                          <div className="ck-item-qty">Qty: {item.quantity}</div>
                        </div>
                        <div className="ck-item-price">
                          ₹{((p?.price || 0) * item.quantity).toLocaleString("en-IN")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="ck-summary">
              <div className="ck-sum-head"><h3>Price Summary</h3></div>
              <div className="ck-sum-body">
                <div className="ck-sum-row">
                  <span className="ck-sum-label">Subtotal ({totalQty} items)</span>
                  <span className="ck-sum-val">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="ck-sum-row">
                  <span className="ck-sum-label">Delivery</span>
                  <span className="ck-sum-val free">FREE</span>
                </div>
                <div className="ck-sum-row">
                  <span className="ck-sum-label">GST (18%)</span>
                  <span className="ck-sum-val">
                    ₹{gst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="ck-divider" />
                <div className="ck-sum-total">
                  <span className="ck-sum-total-label">Total Payable</span>
                  <span className="ck-sum-total-val">
                    ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Payment Method Selector */}
                <div className="ck-pay-label">Payment Method</div>
                <div className="ck-pay-options">
                  <div
                    className={`ck-pay-opt ${paymentMethod === "cod" ? "cod-active" : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <div className="ck-pay-icon">💵</div>
                    <div className="ck-pay-name">Cash on Delivery</div>
                  </div>
                  <div
                    className={`ck-pay-opt ${paymentMethod === "razorpay" ? "rzp-active" : ""}`}
                    onClick={() => setPaymentMethod("razorpay")}
                  >
                    <div className="ck-pay-icon">💳</div>
                    <div className="ck-pay-name">Razorpay</div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  className="ck-place-btn"
                  onClick={placeOrder}
                  disabled={placing || addresses.length === 0}
                >
                  {placing && <span className="ck-spin" />}
                  {placing
                    ? "Processing…"
                    : paymentMethod === "razorpay"
                    ? "Pay with Razorpay →"
                    : "Place Order (COD) →"}
                </button>
              </div>
              <div className="ck-sum-foot">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                256-bit SSL encrypted checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}