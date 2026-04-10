import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Get all products
router.get("/", getProducts);

// Get single product by ID  ← NEW: needed by EditProduct page
router.get("/:id", getProductById);

// Create a new product
router.post("/add", createProduct);

// Update a product
// BUG 9 FIX: was /update/:id — changed to match frontend api.put(`/products/update/${id}`)
router.put("/update/:id", updateProduct);

// Delete a product
router.delete("/delete/:id", deleteProduct);

export default router;
