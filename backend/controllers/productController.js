import product from "../model/product.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const Product = new product(req.body);
    await Product.save();
    res.status(201).json({
      message: "Product created successfully",
      product: Product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await product.find().sort({ createdAt: -1 });
    // BUG 8 FIX: was returning { products } (nested object), frontend was reading
    // response.data directly as an array — now consistent: always return { products: [] }
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product by ID  ← NEW: needed by EditProduct to load one product
export const getProductById = async (req, res) => {
  try {
    const found = await product.findById(req.params.id);
    if (!found) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ product: found });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const updated = await product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product updated successfully", product: updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    // BUG 8b FIX: was missing res.json() — request would hang forever with no response
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
