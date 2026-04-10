// routes/paymentRoutes.js
// ─────────────────────────────────────────────────────────────
// Install first:  npm install razorpay
// ─────────────────────────────────────────────────────────────

import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();
console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
// Called by frontend before opening Razorpay popup
router.post("/create-order", async (req, res) => {
  const { amount } = req.body; // amount in ₹ (e.g. 1180.00)
  try {
    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt:  `receipt_${Date.now()}`,
    });
    res.json(order); // returns { id, amount, currency, ... }
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/verify
// Called by frontend after user completes payment — verifies signature
router.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ success: true, paymentId: razorpay_payment_id });
  } else {
    res.status(400).json({ success: false, error: "Invalid signature" });
  }
});

export default router;