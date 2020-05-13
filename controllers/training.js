/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
const moment = require('moment');
const joi = require('joi');
const { ObjectId } = require('mongodb');

const Training = require('../models/training');

const GET_ALL_TRAININGS = async (req, res) => {
  try {
    const { where } = req.query;
    let query = {};
    if (where) {
      query = JSON.parse(where);
      if (query.organizationId) {
        query.organizationId = ObjectId(query.organizationId);
      }
    }
    const trainings = await Training.find(query)
      .sort({ createdAt: -1 })
      .populate('organizationId')
      .lean()
      .exec();
    // eslint-disable-next-line array-callback-return
    trainings.map((training) => {
      training.trainingDate = moment(training.trainingDate).format('DD-MM-YYYY');
    });
    return res.status(200).send({
      data: trainings,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    res.status(500).json(error);
  }
};

const GET_SPECIFIC_TRAINING = async (req, res) => {
  try {
    const { id } = req.params;
    const training = await Training.findOne({ _id: id })
      .sort({ createdAt: -1 })
      .populate('organizationId')
      .lean()
      .exec();
    return res.status(200).send({
      data: training,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    return res.status(500).json(error);
  }
};

const ADD_NEW_TRAINING = async (req, res) => {
  const { body } = req;

  const schema = {
    organizationId: joi.string().required(),
    trainingDate: joi.string(),
    status: joi.string(),
  };

  const { error } = joi.validate(body, schema);


  if (!error) {
    const newTraining = new Training(req.body);
    newTraining.save(async (err, training) => {
      const l = await Training.findOne({ _id: training._id })
        .populate('organizationId')
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      return res.status(200).send({
        data: l,
        message: 'Success',
      });
    });
    // newTraining.save();
    // const training = await Training.findOne({ _id: newTraining._id })
    //   .populate('organizationId');
    // return res.status(201).send({
    //   message: 'Successfully created a new training',
    //   data: training,
    // });
  }
  const err = [];
  err.push({ msg: error.message });
  return res.status(500).send({
    error: err,
  });
};

const UPDATE_TRAINING = (req, res) => {
  const query = { _id: req.params.id };
  const { body } = req;

  const schema = {
    trainingDate: joi.string(),
    trainerName: joi.string(),
    topic: joi.string(),
    attendees: joi.array().items(joi.object().keys({
      name: joi.string(),
      position: joi.string(),
      department: joi.string(),
      feedback: joi.string(),
    })),
    status: joi.string(),
    type: joi.string(),
  };

  const { error } = joi.validate(body, schema);

  if (!error) {
    Training.findOneAndUpdate(query, body, { upsert: false }, (err) => {
      if (err) return res.send(500, { error: err });
      return res.send('Successfully updated');
    });
  } else {
    res.send(500, { error });
  }
};

const DELETE_TRAINING = async (req, res) => {
  const trainingId = req.params.id;
  Training.findByIdAndDelete(trainingId, (err) => {
    if (err) return res.send(500, { error: err });
    return res.send('Successfully deleted');
  });
};


module.exports = {
  GET_ALL_TRAININGS,
  GET_SPECIFIC_TRAINING,
  ADD_NEW_TRAINING,
  UPDATE_TRAINING,
  DELETE_TRAINING,
};
