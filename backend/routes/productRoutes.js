const express = require("express");

const router = express.Router();

const Product = require("../models/Product");



/* =========================
   GET ALL PRODUCTS
========================= */

router.get("/", async (req, res) => {

  try {

    const products = await Product.find();

    res.json(products);

  } catch (err) {

    res.status(500).json({

      message: "Failed to fetch products"

    });

  }

});



/* =========================
   ADD PRODUCT
========================= */

router.post("/", async (req, res) => {

  try {

    const newProduct = new Product({

      name: req.body.name,

      price: req.body.price,

      image: req.body.image

    });

    const savedProduct =
      await newProduct.save();

    res.status(201).json(savedProduct);

  } catch (err) {

    res.status(500).json({

      message: "Failed to add product"

    });

  }

});



/* =========================
   UPDATE PRODUCT
========================= */

router.put("/:id", async (req, res) => {

  try {

    const updatedProduct =
      await Product.findByIdAndUpdate(

        req.params.id,

        {

          name: req.body.name,

          price: req.body.price,

          image: req.body.image

        },

        { new: true }

      );

    res.json(updatedProduct);

  } catch (err) {

    res.status(500).json({

      message: "Failed to update product"

    });

  }

});



/* =========================
   DELETE PRODUCT
========================= */

router.delete("/:id", async (req, res) => {

  try {

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({

      message: "Product Deleted"

    });

  } catch (err) {

    res.status(500).json({

      message: "Failed to delete product"

    });

  }

});



module.exports = router;