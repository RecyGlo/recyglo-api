const mongoose = require('mongoose');

const { Schema } = mongoose;

const OnDemandSchema = new Schema(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    status: {
      type: String,
      default: 'PENDING',
    },
    remark: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvalMessage: {
      type: String,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

const OnDemand = mongoose.model('OnDemand', OnDemandSchema);

module.exports = OnDemand;
