/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */

const Service = require('../models/service');

const GET_ALL_SERVICES = async (req, res) => {
  try {
    const services = await Service.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: services,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GET_SPECIFIC_SERVICE = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findOne({ _id: id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: service,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    return res.status(500).json(error);
  }
};

module.exports = {
  GET_ALL_SERVICES,
  GET_SPECIFIC_SERVICE,
};
