/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
// const moment = require('moment');
// const jwt = require('jsonwebtoken');
// const config = require('../config/config');
const joi = require('joi');
const CryptoJS = require('crypto-js');
const GeneralPayment = require('../models/generalPayment');
const Order = require('../models/order');

const GET_ALL_PAYMENTS = async (req, res) => {
  try {
    const payments = await GeneralPayment.find({})
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: payments,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GET_SPECIFIC_PAYMENT = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await GeneralPayment.findOne({ _id: id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: payment,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    res.status(500).json(error);
  }
};

const ADD_NEW_PAYMENT = async (req, res) => {
  const { body } = req;

  const schema = {
    order_id: joi.string().required(),
    currency: joi.string().required(),
    amount: joi.string().required(),
    transaction_ref: joi.string().required(),
    payment_channel: joi.string(),
    payment_status: joi.string(),
    channel_response_code: joi.string(),
    frontend_confirmed: joi.boolean(),
    masked_pan: joi.string(),
    approval_code: joi.string(),
    eci: joi.string(),
    paid_channel: joi.string(),
    paid_agent: joi.string(),
    card_type: joi.string(),
    issuer_bank: joi.string(),
    issuer_country: joi.string(),
    hash_value: joi.string().required(),
    transaction_datetime: joi.string().required(),
  };

  const { error } = joi.validate(body, schema);

  if (!error) {
    const newPayment = new GeneralPayment(body);
    console.log(newPayment);
    newPayment.save(async (err, payment) => {
      const l = await GeneralPayment.findOne({ _id: payment._id })
        .lean()
        .exec();
      return res.status(200).send({
        data: l,
        message: 'Success',
      });
    });
  } else {
    res.send(500, { error });
  }
};

const TwoCTwoPRedirect = async (req, res) => {
  const { body } = req;

  const schema = {
    version: joi.string(),
    request_timestamp: joi.string(),
    merchant_id: joi.string().required(),
    order_id: joi.string().required(),
    currency: joi.string().required(),
    amount: joi.string().required(),
    invoice_no: joi.string().allow(''),
    transaction_ref: joi.string().required(),
    approval_code: joi.string().allow(''),
    eci: joi.string().allow(''),
    transaction_datetime: joi.string().required(),
    payment_channel: joi.string(),
    payment_status: joi.string(),
    channel_response_code: joi.string(),
    channel_response_desc: joi.string(),
    masked_pan: joi.string().allow(''),
    stored_card_unique_id: joi.string().allow(''),
    backend_invoice: joi.string().allow(''),
    paid_channel: joi.string().allow(''),
    paid_agent: joi.string().allow(''),
    recurring_unique_id: joi.string().allow(''),
    ippPeriod: joi.string().allow(''),
    ippInterestType: joi.string().allow(''),
    ippInterestRate: joi.string().allow(''),
    ippMerchantAbsorbRate: joi.string().allow(''),
    payment_scheme: joi.string(),
    process_by: joi.string(),
    sub_merchant_list: joi.string().allow(''),
    card_type: joi.string().allow(''),
    issuer_bank: joi.string().allow(''),
    issuer_country: joi.string().allow(''),
    user_defined_1: joi.string().allow(''),
    user_defined_2: joi.string().allow(''),
    user_defined_3: joi.string().allow(''),
    user_defined_4: joi.string().allow(''),
    user_defined_5: joi.string().allow(''),
    browser_info: joi.string().allow(''),
    mcp: joi.string().allow(''),
    mcp_amount: joi.string().allow(''),
    mcp_currency: joi.string().allow(''),
    mcp_exchange_rate: joi.string().allow(''),
    hash_value: joi.string().required(),
  };

  const { error } = joi.validate(body, schema);

  if (!error) {

    // check hash_value done

    const {
      version,
      request_timestamp,merchant_id,
      order_id,invoice_no,
      currency,amount,transaction_ref,approval_code,eci,transaction_datetime,payment_channel,
      payment_status,channel_response_code,channel_response_desc,masked_pan,stored_card_unique_id,
      backend_invoice,paid_channel,paid_agent,recurring_unique_id,user_defined_1,user_defined_2,
      user_defined_3,user_defined_4,user_defined_5,browser_info,ippPeriod,ippInterestType,ippInterestRate,
      ippMerchantAbsorbRate,payment_scheme,process_by,sub_merchant_list, mcp, mcp_amount, mcp_currency, mcp_exchange_rate, hash_value,
    } = body;
    const checkHashStr = `${version}${request_timestamp}${merchant_id}${order_id}${invoice_no}${currency}${amount}${transaction_ref}${approval_code}${eci}${transaction_datetime}${payment_channel}${payment_status}${channel_response_code}${channel_response_desc}${masked_pan}${stored_card_unique_id}${backend_invoice}${paid_channel}${paid_agent}${recurring_unique_id}${user_defined_1}${user_defined_2}${user_defined_3}${user_defined_4}${user_defined_5}${browser_info}${ippPeriod}${ippInterestType}${ippInterestRate}${ippMerchantAbsorbRate}${payment_scheme}${process_by}${sub_merchant_list}${mcp}${mcp_amount}${mcp_currency}${mcp_exchange_rate}`;
    // const secret_key = 'DE8473B19F8B8E2F84838522A218B84D2D598DA5879225388A1E47B9E06ADBFC';
    const secret_key = 'B4BDE1B91B054445C14A349C913BB2411FBD921C297DA7AD12053B57A6638B77';
    const checkHash = CryptoJS.HmacSHA256(checkHashStr, secret_key, false);
    console.log(checkHash.toString().toLowerCase());
    if (checkHash.toString().toLowerCase() == hash_value.toLowerCase()) {
      console.log('Hash check = success.');
    } else {
      return res.status(401).send('Hash check = failed.');
    }

    // check merchant_id
    if (!merchant_id === '104104000000387') {
      return res.status(403).send('Incorrect Merchant Id');
    }

    // const order = await Order.findOne({ _id: parseInt('123') })
    //   .lean()
    //   .exec();
    // console.log(order);

    // if (!order) {
    //   return res.status(401).send('Order Does not exist');
    // }

    const payment = await GeneralPayment.findOne({ order_id: order_id })
      .lean()
      .exec();
    console.log(payment);

    if (!payment) {
      const data = {
        order_id: order_id,
        currency: currency,
        amount: amount,
        transaction_ref: transaction_ref,
        payment_channel: payment_channel,
        payment_status: payment_status,
        channel_response_code: channel_response_code,
        frontend_confirmed: false,
        masked_pan: masked_pan,
        approval_code: approval_code,
        eci: eci,
        paid_channel: payment_channel,
        paid_agent: paid_agent,
        // card_type: card_type,
        // issuer_bank: issuer_bank,
        // issuer_country: issuer_country,
        hash_value: hash_value,
        transaction_datetime: transaction_datetime,
      };
  
      const newPayment = new GeneralPayment(data);
      console.log(newPayment);
      newPayment.save(async (err, payment) => {
        const l = await GeneralPayment.findOne({ _id: payment._id })
          .lean()
          .exec();
        return res.status(200).send({
          data: l,
          message: 'Success',
        });
      });
    } else {
      return res.status(200).send('Order Exists!');
    }

    
    // return res.status(200).send({
    //   data: body,
    //   message: 'Success',
    // });
    // return res.status(200).send('Welcome to Payment API');

    // check hash_value done
    // check merchant_id
    // check order_id
    // convert amount and currency
    // check status
    // prepare for insert

    // const newPayment = new GeneralPayment(body);
    // console.log(newPayment);
    // newPayment.save(async (err, payment) => {
    //   const l = await GeneralPayment.findOne({ _id: payment._id })
    //     .lean()
    //     .exec();
    //   return res.status(200).send({
    //     data: l,
    //     message: 'Success',
    //   });
    // });
  } else {
    res.send(500, { error });
  }
};

const UPDATE_PAYMENT = (req, res) => {
  const query = { _id: req.params.id };
  const { body } = req;

  const schema = {
    order_id: joi.string(),
    currency: joi.string(),
    amount: joi.string(),
    transaction_ref: joi.string(),
    payment_channel: joi.string(),
    payment_status: joi.string(),
    frontend_confirmed: joi.boolean(),
    masked_pan: joi.string(),
    approval_code: joi.string(),
    eci: joi.string(),
    paid_channel: joi.string(),
    paid_agent: joi.string(),
    card_type: joi.string(),
    issuer_bank: joi.string(),
    issuer_country: joi.string(),
    hash_value: joi.string(),
    transaction_datetime: joi.string(),
  };

  const { error } = joi.validate(body, schema);

  if (!error) {
    GeneralPayment.findOneAndUpdate(query, body, { upsert: false }, (err) => {
      if (err) return res.send(500, { error: err });
      return res.send('Successfully updated');
    });
  } else {
    res.send(500, { error });
  }
};

const DELETE_PAYMENT = async (req, res) => {
  const paymentId = req.params.id;
  GeneralPayment.findByIdAndDelete(paymentId, (err) => {
    if (err) return res.send(500, { error: err });
    return res.send('Successfully deleted');
  });
};

module.exports = {
  GET_ALL_PAYMENTS,
  GET_SPECIFIC_PAYMENT,
  ADD_NEW_PAYMENT,
  UPDATE_PAYMENT,
  DELETE_PAYMENT,
  TwoCTwoPRedirect,
};
