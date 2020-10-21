const mongoose = require('mongoose');

const { Schema } = mongoose;

const GeneralPaymentSchema = new Schema(
  {
    order_id: {
      type: String,
      required: true,
      unique: true,
    },
    currency: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    transaction_ref: {
      type: String,
      required: true,
    },
    payment_channel: {
      type: String,
    },
    payment_status: {
      type: String,
    },
    channel_response_code: {
      type: String,
    },
    frontend_confirmed: {
      type: Boolean,
      default: false,
    },
    masked_pan: {
      type: String,
    },
    approval_code: {
      type: String,
    },
    eci: {
      type: String,
    },
    paid_channel: {
      type: String,
    },
    paid_agent: {
      type: String,
    },
    card_type: {
      type: String,
    },
    issuer_bank: {
      type: String,
    },
    issuer_country: {
      type: String,
    },
    hash_value: {
      type: String,
      required: true,
    },
    transaction_datetime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const GeneralPayment = mongoose.model('GeneralPayment', GeneralPaymentSchema);

module.exports = GeneralPayment;
