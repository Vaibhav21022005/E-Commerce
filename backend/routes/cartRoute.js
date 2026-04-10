import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  decreaseCartItem,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add",          addToCart);
router.post("/remove",       removeFromCart);   
router.post("/update",       updateCartItem);
router.post("/decrease",     decreaseCartItem);
router.delete("/clear/:userId", clearCart);
router.get("/:userId",       getCart);          
export default router;