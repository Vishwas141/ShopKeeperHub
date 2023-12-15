const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    
  },
  productname: { type: String, required: true },

  category: { type: String, default: '-' },

  expiry_date: { type: Date, required: true }
  
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
