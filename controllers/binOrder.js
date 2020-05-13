/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
const joi = require('joi');
const BinOrder = require('../models/binOrder');
const Bin = require('../models/bin');

const GET_ALL_BIN_ORDERS = async (req, res) => {
  try {
    const binOrders = await BinOrder.find()
      .populate('organization')
      .populate('bin')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: binOrders,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GET_SPECIFIC_BIN_ORDER = async (req, res) => {
  try {
    const { id } = req.params;
    const binOrder = await BinOrder.findOne({ _id: id })
      .populate('organization')
      .populate('bin')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: binOrder,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    return res.status(500).json(error);
  }
};

const ADD_NEW_BIN_ORDER = async (req, res) => {
  const { body } = req;

  const schema = {
    organization: joi.string().required(),
    bin: joi.string().required(),
    quantity: joi.number().required(),
    orderDate: joi.date(),
    deliverDate: joi.string(),
    acceptedBy: joi.string(),
    status: joi.string(),
  };

  const { error } = joi.validate(body, schema);


  if (!error) {
    const bin = await Bin.findOne({ _id: body.bin })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    body.total = bin.price * body.quantity;
    const newBinOrder = new BinOrder(body);
    newBinOrder.save(async (err, binOrder) => {
      // eslint-disable-next-line no-underscore-dangle
      const data = await BinOrder.findOne({ _id: binOrder._id })
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      return res.status(200).send({
        data,
        message: 'Success',
      });
    });
  } else {
    return res.status(500).send({
      error,
    });
  }
};


const UPDATE_BIN_ORDER = async (req, res) => {
  const query = { _id: req.params.id };
  const { body } = req;

  const schema = {
    organization: joi.string(),
    bin: joi.string(),
    quantity: joi.number(),
    orderDate: joi.date(),
    deliverDate: joi.string(),
    acceptedBy: joi.string(),
    status: joi.string(),
  };

  const { error } = joi.validate(body, schema);

  if (!error) {
    if (body.quantity) {
      const bin = await Bin.findOne({ _id: body.bin })
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      body.total = bin.price * body.quantity;
    }
    BinOrder.findOneAndUpdate(query, body, { upsert: false }, (err) => {
      if (err) return res.send(500, { error: err });
      return res.send('Successfully updated');
    });
  } else {
    res.send(500, { error });
  }
};

const DELETE_BIN_ORDER = async (req, res) => {
  const binOrderId = req.params.id;
  BinOrder.findByIdAndDelete(binOrderId, (err) => {
    if (err) return res.send(500, { error: err });
    return res.send('Successfully deleted');
  });
};


module.exports = {
  GET_ALL_BIN_ORDERS,
  GET_SPECIFIC_BIN_ORDER,
  ADD_NEW_BIN_ORDER,
  UPDATE_BIN_ORDER,
  DELETE_BIN_ORDER,
};
