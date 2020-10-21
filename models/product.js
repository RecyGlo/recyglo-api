const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ['USD', 'MMK'],
      default: 'MMK',
    },
    stock: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
