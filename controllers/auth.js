/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const joi = require('joi');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const bcrypt = require('bcryptjs');

const jwtDecode = require('jwt-decode');
const config = require('../config/config');
const User = require('../models/user');
const tokenList = require('../index');
const Helper = require('../controllers/helper');

const register = async (req, res) => {
  const { body } = req;
  const {
    name, phoneNumber, email, countryCode, profilePicture, password,
  } = body;

  return User.create({
    name,
    phoneNumber,
    email,
    countryCode,
    profilePicture,
    password,
  })
    .then(async (user) => {
      const payload = user.toJSON();
      const secret = process.env.SECRET || 'RecygloMyanmar';
      const token = await jwt.sign(payload, secret, { expiresIn: 60 * 60 * 12 * 1000 });
      return res.status(200).send({
        success: true,
        token: `Bearer ${token}`,
      });
    })
    .catch(err => res.status(err.statusCode || 400).send({
      message: err.message,
    }));
};

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, config.jwtSecret);
    req.userData = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth Failed',
    });
  }
};

const LOG_IN = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }
    let user = null;

    user = await User.findOne({ email })
      .populate('organizationId')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!user) {
      user = await User.findOne({ phoneNumber: email })
        .populate('organizationId')
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    }

    if (user) {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json(err);
        if (isMatch) {
          delete user.password;
          user.createdAt = moment(user.createdAt).format('DD-MM-YYYY');
          const token = jwt.sign(
            { id: user._id },
            config.jwtSecret,
            { expiresIn: config.jwtTokenLife },
          );
          const refreshToken = jwt.sign(
            { id: user._id }, config.refershTokenSecret,
            { expiresIn: config.refreshTokenSecretLife },
          );
          tokenList[refreshToken] = token;
          return res.status(200).send({
            data: user,
            token,
            refreshToken,
            message: 'Success',
          });
        }
        return res.sendStatus(401);
      });
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

const REFRESH_TOKEN = (req, res) => {
  const postData = req.body;
  if ((postData.refreshToken) && (postData.refreshToken in tokenList)) {
    const decoded = jwtDecode(postData.refreshToken);
    const token = jwt.sign(
      { id: decoded.id },
      config.jwtSecret,
      { expiresIn: config.jwtTokenLife },
    );
    const response = {
      token,
    };
    // update the token in the list
    tokenList[postData.refreshToken].token = token;
    res.status(200).json(response);
  } else {
    res.status(404).send('Invalid request');
  }
};

const SEND_PASSWORD_RESET_LINK = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.sendStatus(400);
    }

    user = await User.findOne({ email })
      .lean()
      .exec();

    if (user) {
      const response = await Helper.SEND_EMAIL(email);
      if (response) {
        return res.status(200).send(); 
      }
      console.log(response);
      return res.status(500).send();
    }
    return res.status(401).send('There is no user account with that email');
  } catch (error) {
    console.log('error');
    console.log(error);
    res.status(500).json(error);
  }
};

const RESET_PASSWORD = async (req, res) => {
  try {
    let { link } = req.params;
    if (!link) {
      return res.sendStatus(400);
    }

    const schema = {
      password: joi.string().required(),
    };
  
    const { error } = joi.validate(req.body, schema);

    if (error) {
      return res.status(500).json({ error });
    }

    let email = null;

    try {
      link = link.replace(/SLASH/g, "/");
      console.log(link);
      message = await Helper.DECRYPT(link);
      const { exp } = JSON.parse(message);
      email = JSON.parse(message).email;
      if (new Date(exp) < new Date()) {
        return res.status(400).json({ message: 'The link was expired.' });
      }
      // return res.status(200).json({ message: 'Successfully updated' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Please enter the correct information' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    await User.findOneAndUpdate({ email: email }, { password: hash }, { upsert: false }, (err) => {
      if (err) return res.send(500, { error: err });
      return res.status(200).json({ message: 'Successfully updated' });
    });
    // user = await User.findOne({ email })
    //   .lean()
    //   .exec();

    // console.log(user);

    // if (user) {
    //   const salt = await bcrypt.genSalt(10);
    //   const hash = await bcrypt.hash(req.body.password, salt);
    //   await User.findOneAndUpdate({ email: email }, { password: hash }, { upsert: false }, (err) => {
    //     if (err) return res.send(500, { error: err });
    //     return res.status(200).json({ message: 'Successfully updated' });
    //   });
    // }
    // return res.status(401).json({
    //   message: 'Auth Failed',
    // });
  } catch (error) {
    console.log('error');
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  register,
  checkAuth,
  REFRESH_TOKEN,
  LOG_IN,
  SEND_PASSWORD_RESET_LINK,
  RESET_PASSWORD,
};
