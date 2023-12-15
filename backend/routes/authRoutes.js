// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controller/authController');

const { userProduct ,createProduct, removeProduct,addproductviaFile, expiryNotification} = require("../controller/productController");


// Register user
router.route('/signup').post(registerUser);

// Login user
router.route('/login').post(loginUser);


router.route("/products").get(userProduct);

router.route("/add").post(createProduct);

router.route("/removeProduct/:_id").get(removeProduct);

router.route("/addproductviaFile").post(addproductviaFile);

router.route("/sendmail").get(expiryNotification);




module.exports = router;
