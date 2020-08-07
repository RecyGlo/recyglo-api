/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
// const jwt = require('jsonwebtoken');
// const config = require('../config/config');
const moment = require('moment');
const joi = require('joi');
const Organization = require('../models/organization');

const GET_ALL_ORGANIZATIONS = async (req, res) => {
  try {
    const organizations = await Organization.find({})
      .sort({ name: 1 })
      .lean()
      .exec();
    // eslint-disable-next-line array-callback-return
    organizations.map((organization) => {
      if (organization.contract) {
        organization.contracts.map((contract) => {
          contract.startDate = moment(contract.startDate).format('D MMMM YYYY');
          contract.endDate = moment(contract.endDate).format('D MMMM YYYY');
        });
      }
      organization.startDate = moment(organization.startDate).format('DD-MM-YYYY');
      organization.expiredDate = moment(organization.expiredDate).format('DD-MM-YYYY');
    });

    // organizations.map((organization) => {
    //   organization.contracts.map((contract) => {
    //     contract.startDate = moment(contract.startDate).format('DD-MM-YYYY');
    //     contract.endDate = moment(contract.endDate).format('DD-MM-YYYY');
    //   });
    // });
    return res.status(200).send({
      data: organizations,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GET_SPECIFIC_ORGANIZATION = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findOne({ _id: id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    if (organization.contracts) {
      organization.contracts.map((contract) => {
        contract.startDate = moment(contract.startDate).format('D MMMM YYYY');
        contract.endDate = moment(contract.endDate).format('D MMMM YYYY');
      });
    }
    return res.status(200).send({
      data: organization,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    res.status(500).json(error);
  }
};

const ADD_NEW_ORGANIZATION = async (req, res) => {
  const { body } = req;

  const schema = {
    name: joi.string().required(),
    info: joi.string().required(),
    noOfEmployee: joi.number(),
    address: joi.string(),
    email: joi.string(),
    officePhoneNumber: joi.string(),
    contactPersonName: joi.string(),
    contactPersonPhoneNumber: joi.string(),
    startDate: joi.date().iso(),
    expiredDate: joi.date(),
    companyType: joi.string().required(),
    logo: joi.string(),
    contracts: joi.array().items(joi.object().keys({
      startDate: joi.date(),
      endDate: joi.date(),
    })),
    location: joi.object().keys({
      lng: joi.number(),
      lat: joi.number(), 
    }),
  };

  const { error } = joi.validate(body, schema);


  if (!error) {
    const { name, email } = body;
    const organizationExist = await Organization.find({ name });
    if (organizationExist && organizationExist.length) {
      return res.status(409).json('Organization already exists');
    }

    if (email) {
      const emailExist = await Organization.find({ email });
      if (emailExist && emailExist.length) {
        return res.status(409).json('Email already exists');
      }
    }

    const newOrganization = new Organization(req.body);
    newOrganization.save();
    return res.status(201).send({
      message: 'Successfully created a new organization',
      data: newOrganization,
    });
  }
  const err = [];
  err.push({ msg: error.message });
  return res.status(500).send(error.message);
};

const UPDATE_ORGANIZATION = (req, res) => {
  const query = { _id: req.params.id };
  const { body } = req;

  const schema = {
    name: joi.string(),
    info: joi.string(),
    noOfEmployee: joi.number(),
    address: joi.string(),
    email: joi.string(),
    officePhoneNumber: joi.string(),
    contactPersonName: joi.string(),
    contactPersonPhoneNumber: joi.string(),
    companyType: joi.string(),
    startDate: joi.date(),
    expiredDate: joi.date(),
    status: joi.string(),
    logo: joi.string(),
    contracts: joi.array().items(joi.object().keys({
      _id: joi.string(),
      startDate: joi.date(),
      endDate: joi.date(),
    })),
    location: joi.object().keys({
      lng: joi.number(),
      lat: joi.number(), 
    }),
  };

  const { error } = joi.validate(body, schema);

  if (!error) {
    Organization.findOneAndUpdate(query, body, { upsert: false }, (err) => {
      if (err) return res.send(500, { error: err });
      return res.send('Successfully updated');
    });
  } else {
    res.send(500, { error });
  }
};

const DELETE_ORGANIZATION = async (req, res) => {
  const organizationId = req.params.id;
  Organization.findByIdAndDelete(organizationId, (err) => {
    if (err) return res.send(500, { error: err });
    return res.send('Successfully deleted');
  });
};

module.exports = {
  GET_ALL_ORGANIZATIONS,
  GET_SPECIFIC_ORGANIZATION,
  ADD_NEW_ORGANIZATION,
  UPDATE_ORGANIZATION,
  DELETE_ORGANIZATION,
};
