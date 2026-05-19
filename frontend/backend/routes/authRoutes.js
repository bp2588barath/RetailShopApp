const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Owner = require("../models/Owner");
const Customer = require("../models/Customer");

const router = express.Router();

// JWT Generator
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

/* ================= OWNER REGISTER ================= */
router.post("/owner/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: "Owner already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOwner = new Owner({
      name,
      email,
      password: hashedPassword,
    });

    await newOwner.save();

    res.status(201).json({
      message: "Owner registered successfully",
      userId: newOwner._id,
      role: "owner",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= OWNER LOGIN ================= */
router.post("/owner/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(owner._id, "owner");

    res.json({
      message: "Owner login successful",
      token,
      userId: owner._id,
      role: "owner",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= CUSTOMER REGISTER ================= */
router.post("/customer/register", async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    });

    await newCustomer.save();

    res.status(201).json({
      message: "Customer registered successfully",
      userId: newCustomer._id,
      role: "customer",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= CUSTOMER LOGIN ================= */
router.post("/customer/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(customer._id, "customer");

    res.json({
      message: "Customer login successful",
      token,
      userId: customer._id,
      role: "customer",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;