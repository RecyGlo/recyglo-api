/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
// const moment = require('moment');
// const jwt = require('jsonwebtoken');
// const config = require('../config/config');

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

module.exports = {
  GET_ALL_PRODUCTS,
  GET_SPECIFIC_PRODUCT,
};
