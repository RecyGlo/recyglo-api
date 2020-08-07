const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrganizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    info: {
      type: String,
    },
    noOfEmployee: {
      type: Number,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    officePhoneNumber: {
      type: String,
    },
    contactPersonName: {
      type: String,
    },
    contactPersonPhoneNumber: {
      type: String,
    },
    companyType: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    contracts: [
      {
        startDate: Date,
        endDate: Date,
      },
    ],
    startDate: {
      type: Date,
      default: Date.now(),
    },
    expiredDate: {
      type: Date,
    },
    status: {
      type: String,
      default: 'ACTIVE',
    },
    location: {
      lng: {type: Number},
      lat: {type: Number},
    }
  },
  {
    timestamps: true,
  },
);

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;
