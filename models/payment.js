const mongoose = require('mongoose');

const { Schema } = mongoose;

const PaymentSchema = new Schema(
  {
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    currency: {
      type: String,
      enum: ['USD', 'MMK'],
      default: 'MMK',
    },
    amount: {
      type: Number,
      required: true,
    },
    invoiceDate: {
      type: Date,
      default: Date.now(),
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'SETTLED', 'REJECTED'],
      default: 'PENDING',
    },
    servicePeriod: {
      start: Date,
      end: Date,
    },
    invoiceUrl: {
      type: String,
    },
    paymentDueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
