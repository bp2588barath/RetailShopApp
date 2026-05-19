const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

/* ================= CREATE ORDER ================= */
router.post("/create", async (req, res) => {
  try {
    const { customerId, items, paymentMethod } = req.body;

    let orderItems = [];
    let totalAmount = 0;

    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock not enough for ${product.name}` });
      }

      const total = product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: total,
      });

      totalAmount += total;

      // reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      customerId,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    await newOrder.save();

    // clear cart after order placed
    await Cart.findOneAndDelete({ customerId });

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET ALL ORDERS (ADMIN) ================= */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET ORDERS BY CUSTOMER ID ================= */
router.get("/customer/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= UPDATE ORDER STATUS (ADMIN) ================= */
router.put("/update-status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;