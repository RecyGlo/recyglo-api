const mongoose = require('mongoose');

const BinSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    stock: {
      type: Number,
    },
    price: {
      type: Number,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Bin = mongoose.model('Bin', BinSchema);

module.exports = Bin;
