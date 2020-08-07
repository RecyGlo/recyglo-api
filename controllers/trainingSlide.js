/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
// const jwt = require('jsonwebtoken');
// const config = require('../config/config');
const moment = require('moment');
const joi = require('joi');
const TrainingSlide = require('../models/trainingSlide');

const GET_ALL_TRAINING_SLIDES = async (req, res) => {
  try {
    const trainingSlides = await TrainingSlide.find()
      .sort({ createdAt: -1 })
      .populate('quizID')
      .lean()
      .exec();
    return res.status(200).send({
      data: trainingSlides,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GET_SPECIFIC_TRAINING_SLIDE = async (req, res) => {
  try {
    const { id } = req.params;
    const trainingSlide = await TrainingSlide.findOne({ _id: id })
      .sort({ createdAt: -1 })
      .populate('quizID')
      .lean()
      .exec();
    return res.status(200).send({
      data: trainingSlide,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    return res.status(500).json(error);
  }
};

const ADD_NEW_TRAINING_SLIDE = async (req, res) => {
  const { body } = req;

  const schema = {
    Title: joi.string().required(),
    quizID: joi.string().required(),
    Description: joi.string(),
    Name: joi.string(),
    Slides: joi.array().items(),
    Reference: joi.array().items(),
  };

  const { error } = joi.validate(body, schema);


  if (!error) {
    const newTrainingSlide = new TrainingSlide(req.body);
    newTrainingSlide.save(async (err, trainingSlide) => {
      // eslint-disable-next-line no-underscore-dangle
      const l = await TrainingSlide.findOne({ _id: trainingSlide._id })
        .sort({ createdAt: -1 })
        .populate('quizID')
        .lean()
        .exec();
      return res.status(201).send({
        data: l,
        message: 'Success',
      });
    });
  }
  const err = [];
  err.push({ msg: error.message });
  return res.status(500).send({
    error: err,
  });
};

const UPDATE_TRAINING_SLIDE = async (req, res) => {
  const query = { _id: req.params.id };
  const { body } = req;

  const schema = {
    Title: joi.string().required(),
    quizID: joi.string().required(),
    Description: joi.string(),
    Name: joi.string(),
    Slides: joi.array().items(),
    Reference: joi.array().items(),
  };

  const { error } = joi.validate(body, schema);

  if (!error) {
    TrainingSlide.findOneAndUpdate(query, body, { upsert: false }, (err) => {
      if (err) return res.send(500, { error: err });
      return res.send('Successfully updated');
    });
  } else {
    res.send(500, { error });
  }
  // return res.status(500).send({
  //   error,
  // });
};

const DELETE_TRAINING_SLIDE = async (req, res) => {
  const trainingSlideId = req.params.id;
  TrainingSlide.findByIdAndDelete(trainingSlideId, (err) => {
    if (err) return res.send(500, { error: err });
    return res.send('Successfully deleted');
  });
};

module.exports = {
  GET_ALL_TRAINING_SLIDES,
  GET_SPECIFIC_TRAINING_SLIDE,
  ADD_NEW_TRAINING_SLIDE,
  UPDATE_TRAINING_SLIDE,
  DELETE_TRAINING_SLIDE,
};
