// models/User.js
const mongoose = require('mongoose');
const Product = require("../models/Product");


const userSchema = new mongoose.Schema({

  email: { type: String, required: true },

  password: { type: String, required: true },

  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }]
  
});

const User = mongoose.model('User', userSchema);

module.exports = User;
