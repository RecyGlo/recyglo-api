/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
const joi = require('joi');
const Bin = require('../models/bin');

const GET_ALL_BINS = async (req, res) => {
  try {
    const bins = await Bin.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: bins,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GET_SPECIFIC_BIN = async (req, res) => {
  try {
    const { id } = req.params;
    const bin = await Bin.findOne({ _id: id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: bin,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    return res.status(500).json(error);
  }
};

const ADD_NEW_BIN = async (req, res) => {
  const { body } = req;

  const schema = {
    name: joi.string().required(),
    size: joi.string(),
    stock: joi.number(),
    price: joi.number(),
    image: joi.string(),
  };

  const { error } = joi.validate(body, schema);


  if (!error) {
    const newBin = new Bin(req.body);
    newBin.save(async (err, bin) => {
      // eslint-disable-next-line no-underscore-dangle
      const l = await Bin.findOne({ _id: bin._id })
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      return res.status(200).send({
        data: l,
        message: 'Success',
      });
    });
  }
  // return res.status(500).send({
  //   error,
  // });
};

const UPDATE_BIN = (req, res) => {
  const query = { _id: req.params.id };
  const { body } = req;

  const schema = {
    name: joi.string(),
    size: joi.string(),
    stock: joi.number(),
    price: joi.number(),
    image: joi.string(),
  };

  const { error } = joi.validate(body, schema);

  if (!error) {
    Bin.findOneAndUpdate(query, body, { upsert: false }, (err) => {
      if (err) return res.send(500, { error: err });
      return res.send('Successfully updated');
    });
  } else {
    res.send(500, { error });
  }
};

const DELETE_BIN = async (req, res) => {
  const binId = req.params.id;
  Bin.findByIdAndDelete(binId, (err) => {
    if (err) return res.send(500, { error: err });
    return res.send('Successfully deleted');
  });
};


module.exports = {
  GET_ALL_BINS,
  GET_SPECIFIC_BIN,
  ADD_NEW_BIN,
  UPDATE_BIN,
  DELETE_BIN,
};
