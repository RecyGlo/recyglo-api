/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
// const moment = require('moment');
// const jwt = require('jsonwebtoken');
// const config = require('../config/config');

const Product = require('../models/product');

const RECYGLING_CALCULATOR = async (req, res) => {
  try {
    // const { body } = req;
    const { PAPER, PLASTIC, CAN, GLASS, TOTAL  } = req.body;
    const net_ghg_emission = (-2088 * PAPER / 100) + (249 * PLASTIC / 100) + (-12093 * CAN / 100) + (-454 * GLASS / 100)
    const total_ghg_emission = net_ghg_emission * TOTAL;
    
    return res.status(200).send({
      data: total_ghg_emission,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  RECYGLING_CALCULATOR,
};
