const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    unit: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
