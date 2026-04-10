import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,  // Added: prevents saving quantity 0 or negative at DB level
        },
      },
    ],
  },
  { timestamps: true }  // Added: gives you createdAt/updatedAt on the cart
);

export default mongoose.model("Cart", cartSchema);