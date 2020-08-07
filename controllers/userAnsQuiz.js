/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
// const jwt = require('jsonwebtoken');
// const config = require('../config/config');
const moment = require('moment');
const joi = require('joi');
const UserAnsQuiz = require('../models/userAnsQuiz');

const GET_ALL_USER_ANS_QUIZZES = async (req, res) => {
  try {
    const userAnsQuizzes = await UserAnsQuiz.find(query)
      .sort({ createdAt: -1 })
      .populate('quizId')
      .populate('userId')
      .lean()
      .exec();
    return res.status(200).send({
      data: userAnsQuizzes,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    res.status(500).json(error);
  }
};

const GET_SPECIFIC_USER_ANS_QUIZ = async (req, res) => {
  try {
    const { id } = req.params;
    const userAnsQuiz = await UserAnsQuiz.findOne({ _id: id })
      .sort({ createdAt: -1 })
      .populate('quizId')
      .populate('userId')
      .lean()
      .exec();
    return res.status(200).send({
      data: userAnsQuiz,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    return res.status(500).json(error);
  }
};

const ADD_NEW_USER_ANS_QUIZ = async (req, res) => {
  const { body } = req;

  const schema = {
    quizID: joi.string().required(),
    userID: joi.string().required(),
    UserAns: joi.array().items(),
    TotalCorrectAns: joi.number(),
    TotalCorrectPersentage: joi.number(),
  };

  const { error } = joi.validate(body, schema);


  if (!error) {
    const newUserAnsQuiz = new UserAnsQuiz(req.body);
    newUserAnsQuiz.save(async (err, userAnsQuiz) => {
      // eslint-disable-next-line no-underscore-dangle
      const l = await UserAnsQuiz.findOne({ _id: userAnsQuiz._id })
        .sort({ createdAt: -1 })
        .populate('quizId')
        .populate('userId')
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

const UPDATE_USER_ANS_QUIZ = async (req, res) => {
  const query = { _id: req.params.id };
  const { body } = req;

  const schema = {
    quizId: joi.string().required(),
    userId: joi.string().required(),
    UserAns: joi.array().items(),
    TotalCorrectAns: joi.number(),
    TotalCorrectPersentage: joi.number(),
  };

  const { error } = joi.validate(body, schema);

  if (!error) {
    UserAnsQuiz.findOneAndUpdate(query, body, { upsert: false }, (err) => {
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

const DELETE_USER_ANS_QUIZ = async (req, res) => {
  const userAnsQuizId = req.params.id;
  UserAnsQuiz.findByIdAndDelete(userAnsQuizId, (err) => {
    if (err) return res.send(500, { error: err });
    return res.send('Successfully deleted');
  });
};

module.exports = {
  GET_ALL_USER_ANS_QUIZZES,
  GET_SPECIFIC_USER_ANS_QUIZ,
  ADD_NEW_USER_ANS_QUIZ,
  UPDATE_USER_ANS_QUIZ,
  DELETE_USER_ANS_QUIZ,
};
