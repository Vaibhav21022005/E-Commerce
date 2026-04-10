import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      quantity: { type: Number, required: true },
      price:    { type: Number, required: true },
    },
  ],
  address: {
    fullName:    { type: String, required: true },
    phone:       { type: String, required: true },
    addressLine: { type: String, required: true },
    city:        { type: String, required: true },
    State:       { type: String, required: true },
    pin:         { type: String, required: true },
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  // ── Payment fields (NEW) ──────────────────────────────────
  paymentMethod: {
    type: String,
    enum: ["COD", "Razorpay"],
    default: "COD",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },
  paymentId: {
    type: String,   // Razorpay payment ID — null for COD
    default: null,
  },
  // ─────────────────────────────────────────────────────────
  status: {
    type: String,
    default: "Placed",
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);