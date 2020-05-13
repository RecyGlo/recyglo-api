const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new mongoose.Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Report = mongoose.model('Report', ProductSchema);

module.exports = Report;
