const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

/* ================= ADD TO CART ================= */
router.post("/add", async (req, res) => {
  try {
    const { customerId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ customerId });

    if (!cart) {
      cart = new Cart({
        customerId,
        items: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.json({ message: "Added to cart successfully", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET CART ================= */
router.get("/:customerId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId }).populate("items.productId");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= UPDATE QUANTITY ================= */
router.put("/update", async (req, res) => {
  try {
    const { customerId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ customerId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1)
      return res.status(404).json({ message: "Item not found in cart" });

    cart.items[itemIndex].quantity = quantity;

    // if quantity becomes 0 remove it
    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= REMOVE ITEM ================= */
router.delete("/remove/:customerId/:productId", async (req, res) => {
  try {
    const { customerId, productId } = req.params;

    const cart = await Cart.findOne({ customerId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= CLEAR CART ================= */
router.delete("/clear/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    await Cart.findOneAndDelete({ customerId });

    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;