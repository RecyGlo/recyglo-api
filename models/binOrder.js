const mongoose = require('mongoose');

const { Schema } = mongoose;

const BinOrderSchema = new mongoose.Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    bin: {
      type: Schema.Types.ObjectId,
      ref: 'Bin',
    },
    quantity: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliverDate: {
      type: Date,
      default: Date.now,
    },
    acceptedBy: {
      type: String,
    },
    status: {
      type: String,
      enum: ['REQUESTED', 'CONFIRMED', 'ONHOLD', 'COMPLETED'],
      default: 'REQUESTED',
    },
  },
  {
    timestamps: true,
  },
);

const BinOrder = mongoose.model('BinOrder', BinOrderSchema);

module.exports = BinOrder;
