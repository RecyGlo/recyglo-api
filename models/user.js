/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['ADMIN', 'USER', 'DRIVER', 'OPERATION'],
      default: 'USER',
    },
    phoneNumber: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    isConfirm: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre('save', async function (next) {
  if (this._doc.password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this._doc.password, salt);
    this._doc.password = hash;
  }
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
