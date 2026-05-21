const express = require("express");

const router = express.Router();

const Order = require("../models/Order");



/* GET ORDERS */

router.get("/", async (req,res) => {

  try {

    const orders = await Order.find();

    res.json(orders);

  } catch(err) {

    res.status(500).json(err);

  }

});



/* ADD ORDER */

router.post("/", async (req,res) => {

  try {

    const newOrder = new Order(req.body);

    const savedOrder =
      await newOrder.save();

    res.status(201).json(savedOrder);

  } catch(err) {

    res.status(500).json(err);

  }

});



/* UPDATE ORDER STATUS */

router.put("/:id", async (req,res) => {

  try {

    const updatedOrder =
      await Order.findByIdAndUpdate(

        req.params.id,

        req.body,

        { new:true }

      );

    res.json(updatedOrder);

  } catch(err) {

    res.status(500).json(err);

  }

});



module.exports = router;