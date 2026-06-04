const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../models/User");



/* REGISTER */

router.post("/register", async(req,res)=>{

  try{

    const hashedPassword =
      await bcrypt.hash(req.body.password,10);

const newUser = new User({
  name: req.body.name,
  email: req.body.email,
  password: hashedPassword,
  phone: req.body.phone || "",
  address: req.body.address || "",
  role: req.body.role || "customer"
});
    await newUser.save();

    res.json("User Registered");

  }catch(err){

    res.status(500).json(err);

  }

});



/* LOGIN */

router.post("/login", async(req,res)=>{

  try{

    const user =
      await User.findOne({

        email:req.body.email

      });

    if(!user){

      return res.status(404).json(
        "User Not Found"
      );

    }

    const validPassword =
      await bcrypt.compare(

        req.body.password,

        user.password

      );

    if(!validPassword){

      return res.status(400).json(
        "Invalid Password"
      );

    }

    const token = jwt.sign(

      {

        id:user._id,

        role:user.role

      },

      process.env.JWT_SECRET,

      {

        expiresIn:"7d"

      }

    );

    res.json({

      token,

      user

    });

  }catch(err){

    res.status(500).json(err);

  }

});

module.exports = router;