const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhno: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    productDescription: {
      type: String,
    },
    deliveryAddress: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ['USD', 'MMK'],
      default: 'MMK',
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
