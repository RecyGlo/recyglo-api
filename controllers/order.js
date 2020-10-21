/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
// const moment = require('moment');
// const jwt = require('jsonwebtoken');
// const config = require('../config/config');
const joi = require('joi');
const Order = require('../models/order');

const GET_ALL_ORDERS = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('product')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: orders,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GET_SPECIFIC_ORDER = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id })
      .populate('product')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: order,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    res.status(500).json(error);
  }
};

const ADD_NEW_ORDER = async (req, res) => {
  const { body } = req;

  const schema = {
    _id: joi.number().required(),
    customerName: joi.string().required(),
    customerPhno: joi.string().required(),
    customerEmail: joi.string().required(),
    product: joi.string(),
    productDescription: joi.string(),
    deliveryAddress: joi.string(),
    quantity: joi.number(),
    currency: joi.string(),
    totalAmount: joi.number().required(),
    status: joi.string(),
    orderDate: joi.date(),
  };

  const { error } = joi.validate(body, schema);

  if (!error) {
    const newOrder = new Order(body);
    newOrder.save(async (err, order) => {
      console.log(order);
      console.log(err);
      const l = await Order.findOne({ _id: order._id })
        .populate('product')
        .lean()
        .exec();
      return res.status(200).send({
        data: l,
        message: 'Success',
      });
    });
  }
};

const UPDATE_ORDER = (req, res) => {
  const query = { _id: req.params.id };
  const { body } = req;

  const schema = {
    _id: joi.number(),
    customerName: joi.string(),
    customerPhno: joi.string(),
    customerEmail: joi.string(),
    product: joi.string(),
    productDescription: joi.string(),
    deliveryAddress: joi.string(),
    quantity: joi.number(),
    currency: joi.string(),
    totalAmount: joi.number(),
    status: joi.string(),
    orderDate: joi.date(),
  };

  const { error } = joi.validate(body, schema);

  if (!error) {
    Order.findOneAndUpdate(query, body, { upsert: false }, (err) => {
      if (err) return res.send(500, { error: err });
      return res.send('Successfully updated');
    });
  } else {
    res.send(500, { error });
  }
};

const DELETE_ORDER = async (req, res) => {
  const orderId = req.params.id;
  Order.findByIdAndDelete(orderId, (err) => {
    if (err) return res.send(500, { error: err });
    return res.send('Successfully deleted');
  });
};

module.exports = {
  GET_ALL_ORDERS,
  GET_SPECIFIC_ORDER,
  ADD_NEW_ORDER,
  UPDATE_ORDER,
  DELETE_ORDER,
};
