import Order from "../model/Order.js";
import Cart from "../model/Cart.js";
import Product from "../model/product.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId, address } = req.body;

    // Check required fields
    if (!userId || !address) {
      return res.status(400).json({ message: "userId and address required" });
    }

    // Get Cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    // Prepare order items
    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    // Calculate total
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    // Update stock
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Create order
    const order = await Order.create({
      userId,
      items: orderItems,
      address,
      totalAmount,
      paymentMethod: "COD",
    });

    // Clear cart
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.status(201).json({
      message: "Order Placed Successfully",
      orderId: order._id,
    });

  } catch (error) {
    console.log(error); 
    res.status(500).json({ message: error.message });
  }
};