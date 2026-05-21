require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();



/* ===================================
   MIDDLEWARE
=================================== */

app.use(express.json());



/* ===================================
   CORS CONFIGURATION
=================================== */

app.use(

  cors({

    origin: [

      "http://localhost:3000",

      "https://retailshopapp.netlify.app"

    ],

    credentials: true

  })

);



/* ===================================
   IMPORT ROUTES
=================================== */

const productRoutes =
require("./routes/productRoutes");

const authRoutes =
require("./routes/authRoutes");

const cartRoutes =
require("./routes/cartRoutes");

const orderRoutes =
require("./routes/orderRoutes");



/* ===================================
   API ROUTES
=================================== */

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);



/* ===================================
   ROOT ROUTE
=================================== */

app.get("/", (req, res) => {

  res.send(
    "Retail Shop Backend Running 🚀"
  );

});



/* ===================================
   DATABASE CONNECTION
=================================== */

mongoose.connect(

  process.env.MONGO_URI,

  {

    useNewUrlParser: true,

    useUnifiedTopology: true

  }

)

.then(() => {

  console.log(
    "MongoDB Connected Successfully"
  );

})

.catch((err) => {

  console.log(
    "MongoDB Connection Failed"
  );

  console.log(err);

});



/* ===================================
   SERVER
=================================== */

const PORT =
process.env.PORT || 5000;



app.listen(PORT, () => {

  console.log(

    `Server running on port ${PORT}`

  );

});