const mongoose = require('mongoose');

const { Schema } = mongoose;

const LogisticsSchema = new mongoose.Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    items: [
      {
        productName: String,
        productType: String,
        remark: String,
        quantity: Number,
        unit: {
          type: String,
          default: 'kg',
        },
      },
    ],
    pickUpTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['REQUESTED', 'CONFIRMED', 'ONHOLD', 'CANCELLED', 'COMPLETED'],
      default: 'REQUESTED',
    },
    pickUpType: {
      type: String,
      enum: ['DRY', 'ORGANIC', 'BOTH'],
      default: 'DRY',
    },
    vehicle: {
      plate_number: String,
      driver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    operationTeam: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    wayNumber: {
      type: Number,
    },
    remark: {
      type: String,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

const Logistics = mongoose.model('Logistics', LogisticsSchema);

module.exports = Logistics;
