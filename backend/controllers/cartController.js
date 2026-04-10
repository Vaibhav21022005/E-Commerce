import Cart from "../model/Cart.js";

// ─── Add item to cart ────────────────────────────────────────────────────────
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // No cart yet — create a brand new one with this item
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      // BUG 1 FIX: was .find() — returns the object itself, not the index.
      // We need .findIndex() so we can update cart.items[itemIndex].quantity
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );
      // variable names ("item" was never declared, "items.quantity" doesn't exist).
      // Fixed: use itemIndex correctly inside the else block.
      if (itemIndex !== -1) {
        // Item already in cart — increment its quantity
        cart.items[itemIndex].quantity += 1;
      } else {
        // Item not in cart — add it
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    // Also fixed: catch block was missing the error parameter
    res
      .status(500)
      .json({ message: "Failed to add item to cart", error: error.message });
  }
};

// ─── Remove item from cart ───────────────────────────────────────────────────
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to remove item from cart",
        error: error.message,
      });
  }
};

// ─── Update item quantity ─────────────────────────────────────────────────────
export const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate quantity before touching DB
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    // BUG 4 FIX: was checking `if (!item)` — "item" was never declared.
    // findIndex returns -1 when not found, so check itemIndex === -1
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Item quantity updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update cart item", error: error.message });
  }
};

// ─── Decrease item quantity by 1 (NEW) ────────────────────────────────────────
// Added: frontend usually needs a "-1" button separately from a full set-quantity.
// If quantity reaches 0, the item is automatically removed from the cart.
export const decreaseCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (cart.items[itemIndex].quantity <= 1) {
      // Auto-remove when quantity would drop to 0
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity -= 1;
    }

    await cart.save();
    res.status(200).json({ message: "Item quantity decreased successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to decrease cart item", error: error.message });
  }
};

// ─── Get user's cart ──────────────────────────────────────────────────────────
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(200).json({ userId, items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve cart", error: error.message });
  }
};

// ─── Clear entire cart (NEW) ──────────────────────────────────────────────────
// Added: useful for after checkout — empties all items in a user's cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to clear cart", error: error.message });
  }
};
