/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
// const moment = require('moment');
// const jwt = require('jsonwebtoken');
// const config = require('../config/config');
const joi = require('joi');
const Product = require('../models/product');

const GET_ALL_PRODUCTS = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: products,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GET_SPECIFIC_PRODUCT = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: product,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    res.status(500).json(error);
  }
};

const ADD_NEW_PRODUCT = async (req, res) => {
  const { body } = req;

  const schema = {
    name: joi.string().required(),
    description: joi.string(),
    price: joi.number().required(),
    currency: joi.string(),
    stock: joi.number(),
  };

  const { error } = joi.validate(body, schema);

  if (!error) {
    const newProduct = new Product(body);
    newProduct.save(async (err, product) => {
      const l = await Product.findOne({ _id: product._id })
        .lean()
        .exec();
      return res.status(200).send({
        data: l,
        message: 'Success',
      });
    });
  }
};

const UPDATE_PRODUCT = (req, res) => {
  const query = { _id: req.params.id };
  const { body } = req;

  const schema = {
    name: joi.string(),
    description: joi.string(),
    price: joi.number(),
    currency: joi.string(),
    stock: joi.number(),
  };

  const { error } = joi.validate(body, schema);

  if (!error) {
    Product.findOneAndUpdate(query, body, { upsert: false }, (err) => {
      if (err) return res.send(500, { error: err });
      return res.send('Successfully updated');
    });
  } else {
    res.send(500, { error });
  }
};

const DELETE_PRODUCT = async (req, res) => {
  const productId = req.params.id;
  Product.findByIdAndDelete(productId, (err) => {
    if (err) return res.send(500, { error: err });
    return res.send('Successfully deleted');
  });
};

module.exports = {
  GET_ALL_PRODUCTS,
  GET_SPECIFIC_PRODUCT,
  ADD_NEW_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
};
