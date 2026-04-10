import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .os-root{min-height:100vh;font-family:'DM Sans',sans-serif;background:#0b0f1a;display:flex;align-items:center;justify-content:center;padding:40px 24px;position:relative;overflow:hidden;}
        .os-bg{position:fixed;inset:0;z-index:0;background:linear-gradient(160deg,#0b0f1a 0%,#0d1627 55%,#0b0f1a 100%);pointer-events:none;}
        .os-bg::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);background-size:48px 48px;}
        .os-orb{position:fixed;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(0,255,128,0.05) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:0;animation:os-pulse 3s ease-in-out infinite;}
        @keyframes os-pulse{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.08)}}

        .os-card{position:relative;z-index:1;width:100%;max-width:480px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:24px;overflow:hidden;text-align:center;animation:os-rise 0.6s cubic-bezier(0.16,1,0.3,1) both;}
        @keyframes os-rise{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}

        .os-top{padding:40px 32px 28px;border-bottom:1px solid rgba(255,255,255,0.05);}
        .os-icon-wrap{width:80px;height:80px;border-radius:50%;background:rgba(0,255,128,0.1);border:2px solid rgba(0,255,128,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;animation:os-pop 0.5s 0.2s cubic-bezier(0.16,1,0.3,1) both;}
        @keyframes os-pop{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}
        .os-icon{font-size:36px;}
        .os-title{font-family:'Syne',sans-serif;font-size:26px;font-weight:700;color:#fff;margin-bottom:10px;}
        .os-title span{color:#00ff80;}
        .os-sub{font-size:14px;color:rgba(255,255,255,0.38);line-height:1.6;}

        .os-body{padding:24px 32px;}
        .os-id-box{background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.15);border-radius:12px;padding:14px 18px;margin-bottom:24px;}
        .os-id-label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:6px;}
        .os-id-val{font-family:'Syne',sans-serif;font-size:13px;color:#00d4ff;word-break:break-all;font-weight:600;}

        .os-actions{display:flex;flex-direction:column;gap:10px;}
        .os-btn-primary{width:100%;padding:14px;background:linear-gradient(135deg,#00d4ff,#0099cc);border:none;border-radius:11px;color:#0b0f1a;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.25s;}
        .os-btn-primary:hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(0,212,255,0.4);}
        .os-btn-secondary{width:100%;padding:13px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:11px;color:rgba(255,255,255,0.6);font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;transition:all 0.25s;}
        .os-btn-secondary:hover{background:rgba(255,255,255,0.07);color:#fff;}
      `}</style>

      <div className="os-root">
        <div className="os-bg" />
        <div className="os-orb" />

        <div className="os-card">
          <div className="os-top">
            <div className="os-icon-wrap">
              <span className="os-icon">✓</span>
            </div>
            <h1 className="os-title">Order <span>Placed!</span></h1>
            <p className="os-sub">
              Your order has been confirmed and will be delivered soon.
              Thank you for shopping with us!
            </p>
          </div>

          <div className="os-body">
            <div className="os-id-box">
              <div className="os-id-label">Order ID</div>
              <div className="os-id-val">{id}</div>
            </div>

            <div className="os-actions">
              <button
                className="os-btn-primary"
                onClick={() => navigate("/")}
              >
                Continue Shopping →
              </button>
              <button
                className="os-btn-secondary"
                onClick={() => navigate("/orders")}
              >
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}