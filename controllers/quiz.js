/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
// const jwt = require('jsonwebtoken');
// const config = require('../config/config');
const moment = require('moment');
const joi = require('joi');
const Quiz = require('../models/quiz');

const GET_ALL_QUIZZES = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: quizzes,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GET_SPECIFIC_QUIZ = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findOne({ _id: id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: quiz,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    return res.status(500).json(error);
  }
};

const ADD_NEW_QUIZ = async (req, res) => {
  const { body } = req;

  const schema = {
    title: joi.string().required(),
    Questions: joi.array().items(joi.object().keys({
      Question: joi.string(),
      Name: joi.string(),
      OptionalAnswers: joi.array(),
      CorrectAnswer: joi.string(),
      Explanation: joi.string(),
    })),
  };

  const { error } = joi.validate(body, schema);


  if (!error) {
    const newQuiz = new Quiz(req.body);
    newQuiz.save(async (err, quiz) => {
      // eslint-disable-next-line no-underscore-dangle
      const l = await Quiz.findOne({ _id: quiz._id })
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
  const err = [];
  err.push({ msg: error.message });
  return res.status(500).send({
    error: err,
  });
};

const UPDATE_QUIZ = async (req, res) => {
  const query = { _id: req.params.id };
  const { body } = req;

  const schema = {
    title: joi.string().required(),
    Questions: joi.array().items(joi.object().keys({
      Question: joi.string(),
      Answer: joi.array(),
      CorrectAnswer: joi.string(),
      Explanation: joi.string(),
    })),
  };

  const { error } = joi.validate(body, schema);


  if (!error) {
    Quiz.findOneAndUpdate(query, body, { upsert: false }, (err) => {
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

const DELETE_QUIZ = async (req, res) => {
  const quizId = req.params.id;
  Quiz.findByIdAndDelete(quizId, (err) => {
    if (err) return res.send(500, { error: err });
    return res.send('Successfully deleted');
  });
};

module.exports = {
  GET_ALL_QUIZZES,
  GET_SPECIFIC_QUIZ,
  ADD_NEW_QUIZ,
  UPDATE_QUIZ,
  DELETE_QUIZ,
};
