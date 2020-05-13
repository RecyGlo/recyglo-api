/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
const moment = require('moment');
const joi = require('joi');
const Logistics = require('../models/logistics');
const Report = require('../models/report');

const getReportDetail = async (req, res) => {
  try {
    const organizationId = req.user ? req.user.organizationId : '5c5d4abed203530cebb45c85';
    const logistics = await Logistics.find({
      organizationId,
      status: 'COMPLETE',
    })
      .select({ _id: 0, items: 1, pickUpDate: 1 })
      .sort({ pickUpDate: -1 })
      .lean();
    const donut = {};
    const yearlyReport = {};
    const monthlyReport = {};
    // eslint-disable-next-line no-unused-vars
    const lineChart = await Promise.all(
      logistics.map(async (logistic) => {
        const { items } = logistic;
        const itemObject = {};
        let mixedWeight = 0;
        const { pickUpDate } = logistic;
        const year = moment(pickUpDate).format('YYYY');
        const month = moment(pickUpDate).format('MMMM YYYY');
        for (const item of items) {
          const { product } = item;
          const { quantity } = item;
          donut[product] = donut[product] || {};
          donut[product].quantity = donut[product].quantity || 0;
          donut[product].quantity = +(donut[product].quantity + quantity).toFixed(2);
          donut[product].unit = donut[product].unit || 'KG';

          mixedWeight += quantity;

          itemObject[product] = itemObject[product] || {};
          itemObject[product].quantity = quantity;
          itemObject[product].unit = item.unit;

          yearlyReport[year] = yearlyReport[year] || {};
          yearlyReport[year][product] = yearlyReport[year][product] || {};
          yearlyReport[year][product].quantity = yearlyReport[year][product].quantity || 0;
          yearlyReport[year][product].quantity = +(
            yearlyReport[year][product].quantity + quantity
          ).toFixed(2);

          monthlyReport[month] = monthlyReport[month] || {};
          monthlyReport[month][product] = monthlyReport[month][product] || {};
          monthlyReport[month][product].quantity = monthlyReport[month][product].quantity || 0;
          monthlyReport[month][product].quantity = +(
            monthlyReport[month][product].quantity + quantity
          ).toFixed(2);
        }

        logistic.items = itemObject;
        logistic.total = +mixedWeight.toFixed(2);
        logistic.pickUpDate = moment(pickUpDate).format('MMMM DD YYYY');

        return logistic;
      }),
    );
    let total = 0;
    const keys = Object.keys(donut);
    keys.forEach((d) => {
      total += donut[d].quantity;
    });
    total = +total.toFixed(2);

    keys.forEach((d) => {
      const { quantity } = donut[d];
      donut[d].percentage = +((quantity / total) * 100).toFixed(3);
    });

    res.status(200).send({
      data: {
        yearlyReport,
        monthlyReport,
      },
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GET_SPECIFIC_REPORT = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findOne({ _id: id })
      .populate('organization')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: report,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    return res.status(500).json(error);
  }
};

const ADD_NEW_REPORT = async (req, res) => {
  const { body } = req;

  const schema = {
    organization: joi.string().required(),
    title: joi.string().required(),
    data: joi.string().required(),
  };

  const { error } = joi.validate(body, schema);


  if (!error) {
    const newReport = new Report(req.body);
    newReport.save(async (err, report) => {
      // eslint-disable-next-line no-underscore-dangle
      const l = await Report.findOne({ _id: report._id })
        .populate('organization')
        .sort({ createdAt: -1 })
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

module.exports = {
  getReportDetail,
  GET_SPECIFIC_REPORT,
  ADD_NEW_REPORT,
};
