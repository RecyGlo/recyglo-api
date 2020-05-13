/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
const joi = require('joi');
const Logistics = require('../models/logistics');

const GET_ALL_LOGISTICS = async (req, res) => {
  try {
    const { where } = req.query;
    let query = {};
    if (where) {
      query = JSON.parse(where);
    }
    const logisticsList = await Logistics.find(query)
      .populate('organizationId')
      .populate('vehicle.driver')
      .populate('operationTeam')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: logisticsList,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GET_LOGISTICS_BY_ORGANIZATION = async (req, res) => {
  try {
    const { id } = req.params;
    const logistics = await Logistics.find({ organizationId: id })
      .populate('organizationId')
      .populate('vehicle.driver')
      .populate('operationTeam')
      .sort({ pickUpTime: 1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: logistics,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GET_LOGISTICS_BY_ORGANIZATION_FOR_REPORT = async (req, res) => {
  try {
    const { id } = req.params;
    const logistics = await Logistics.find({ organizationId: id, items: { $ne: [] } })
      .populate('organizationId')
      .populate('vehicle.driver')
      .populate('operationTeam')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: logistics,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GET_SPECIFIC_LOGISTICS = async (req, res) => {
  try {
    const { id, where } = req.params;
    const logistics = await Logistics.findOne({ _id: id, where })
      .populate('organizationId')
      .populate('vehicle.driver')
      .populate('operationTeam')
      .populate('updatedBy')
      .lean()
      .exec();
    return res.status(200).send({
      data: logistics,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    res.status(500).json(error);
  }
};

const ADD_NEW_LOGISTICS = async (req, res) => {
  const { body } = req;

  const schema = {
    organizationId: joi.string().required(),
    items: joi.array().items(joi.object().keys({
      productName: joi.string(),
      productType: joi.string(),
      quantity: joi.number(),
      unit: joi.string(),
      remark: joi.string(),
    })),
    vehicle: joi.object({
      plate_number: joi.string(),
      driver: joi.string(),
    }),
    wayNumber: joi.number(),
    pickUpType: joi.string(),
    operationTeam: [joi.string()],
    pickUpTime: joi.string(),
    status: joi.string(),
    remark: joi.string(),
    updatedBy: joi.string(),
  };

  const { error } = joi.validate(body, schema);


  if (!error) {
    const newLogistics = new Logistics(body);
    newLogistics.save(async (err, logistics) => {
      const l = await Logistics.findOne({ _id: logistics._id })
        .populate('organizationId')
        .lean()
        .exec();
      return res.status(200).send({
        data: l,
        message: 'Success',
      });
    });
  }
};

const UPDATE_LOGISTIC = (req, res) => {
  const query = { _id: req.params.id };
  const { body } = req;

  const schema = {
    items: joi.array().items(joi.object().keys({
      productName: joi.string(),
      productType: joi.string(),
      quantity: joi.number(),
      unit: joi.string(),
      remark: joi.string(),
    })),
    vehicle: joi.object({
      plate_number: joi.string(),
      driver: joi.string(),
    }),
    wayNumber: joi.number(),
    operationTeam: joi.array().items(joi.string()),
    pickUpType: joi.string(),
    pickUpTime: joi.string(),
    status: joi.string(),
    remark: joi.string(),
    updatedBy: joi.string(),
  };

  const { error } = joi.validate(body, schema);

  if (!error) {
    Logistics.findOneAndUpdate(query, body, { upsert: false }, (err) => {
      if (err) return res.send(500, { error: err });
      return res.send('Successfully updated');
    });
  } else {
    res.send(500, { error });
  }
};

const DELETE_LOGISTIC = async (req, res) => {
  const logisticId = req.params.id;
  Logistics.findByIdAndDelete(logisticId, (err) => {
    if (err) return res.send(500, { error: err });
    return res.send('Successfully deleted');
  });
};

const GET_TODAY_SCHEDULE = async (req, res) => {
  try {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const logisticsList = await Logistics.find({ pickUpTime: { $gte: today.toLocaleDateString(), $lte: tomorrow.toLocaleDateString() } })
      .populate('organizationId')
      .populate('vehicle.driver')
      .populate('operationTeam')
      .sort({ pickUpTime: 1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: logisticsList,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const GET_SCHEDULE_BY_DATE = async (req, res) => {
  try {
    const { date } = req.params;
    const today = new Date(date);
    const tomorrow = new Date(date);
    tomorrow.setDate(today.getDate() + 1);
    const logisticsList = await Logistics.find({ pickUpTime: { $gte: today.toLocaleDateString(), $lte: tomorrow.toLocaleDateString() } })
      .populate('organizationId')
      .populate('vehicle.driver')
      .populate('operationTeam')
      .sort({ pickUpTime: 1 })
      .lean()
      .exec();
    return res.status(200).send({
      data: logisticsList,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const ADD_ITEMS_TO_LOGISTICS = (req, res) => {
  const query = { _id: req.params.id };
  const { body } = req;

  const item = joi.object().keys({
    productName: joi.string(),
    productType: joi.string(),
    quantity: joi.number(),
    unit: joi.string(),
    remark: joi.string(),
  });

  const schema = {
    items: joi.array().items(item),
  };

  const { error } = joi.validate(body, schema);

  if (!error) {
    Logistics.findOneAndUpdate(query, { $push: { items: { $each: body.items } } }, { upsert: false }, (err) => {
      if (err) return res.send(500, { error: err });
      return res.send('Successfully updated');
    });
  } else {
    res.send(500, { error });
  }
};

const UPDATE_ITEM = (req, res) => {
  console.log(req);
  // const query = { _id: req.params.id };
  const { body } = req;

  const schema = joi.object().keys({
    _id: joi.string(),
    productName: joi.string(),
    productType: joi.string(),
    quantity: joi.number(),
    unit: joi.string(),
    remark: joi.string(),
  });

  const { error } = joi.validate(body, schema);

  const query = { _id: req.params.id, 'items._id': body._id };
  if (!error) {
    Logistics.findOneAndUpdate(query, { $set: { 'items.$': body } }, { upsert: false }, (err) => {
      if (err) return res.send(500, { error: err });
      return res.send('Successfully updated');
    });
  } else {
    res.send(500, { error });
  }
};

const DELETE_ITEM = (req, res) => {
  const { logisticsId, itemId } = req.params;
  const query = { _id: logisticsId, 'items._id': itemId };
  Logistics.findOneAndUpdate(query, { $pull: { items: { _id: itemId } } }, { upsert: false }, (err) => {
    console.log(err);
    if (err) return res.send(500, { error: err });
    return res.send('Successfully deleted');
  });
};


const GET_COMMON_ITEMS_FOUND_FOR_SPECIFIC_ORGANIZATION = async (req, res) => {
  try {
    const { id } = req.params;
    const logistics = await Logistics.find({ organizationId: id, items: { $ne: [] } })
      .populate('organizationId')
      .lean()
      .exec();

    const items = {};
    const wastes = {
      Papers: 'Paper',
      Plastics: 'Plastic',
      Cans: 'Can',
      Glasses: 'Glass',
      'E-waste': 'E-waste',
      Organic: 'Organic',
    };

    for (let i = 0; i < logistics.length; i += 1) {
      for (let j = 0; j < logistics[i].items.length; j += 1) {
        if (Object.keys(items).includes(wastes[logistics[i].items[j].productType])) {
          if (Object.keys(items[wastes[logistics[i].items[j].productType]]).includes(logistics[i].items[j].productName)) {
            items[wastes[logistics[i].items[j].productType]][logistics[i].items[j].productName] += 1;
          } else {
            items[wastes[logistics[i].items[j].productType]][logistics[i].items[j].productName] = 1;
          }
        } else {
          items[wastes[logistics[i].items[j].productType]] = {};
          items[wastes[logistics[i].items[j].productType]][logistics[i].items[j].productName] = 1;
        }
        // if (Object.keys(items).includes(logistics[i].items[j].productName)) {
        //   items[logistics[i].items[j].productName] += 1;
        // } else {
        //   items[logistics[i].items[j].productName] = 1;
        // }
      }
    }
    // console.log(items);
    return res.status(200).send({
      data: items,
      message: 'Success',
    });
  } catch (error) {
    if (error.name && error.name === 'CastError') {
      return res.sendStatus(404);
    }
    res.status(500).json(error);
  }
};


// const ADD_OPERATION_TEAM_TO_LOGISTICS = async (req, res) => {
//   const { body } = req;

//   const schema = {
//     operationTeam: [
//       joi.object({
//         product: joi.string(),
//         quantity: joi.number(),
//         unit: joi.string(),
//       }),
//     ],
//   };

//   const { error } = joi.validate(body, schema);

//   try {
//     const { id } = req.params;
//     const logistics = await Logistics.findOne({ _id: id })
//       .lean()
//       .exec();
//     if (logistics && !logistics.operationTeam) {

//     }
//     return res.status(200).send({
//       data: logistics,
//       message: 'Success',
//     });
//   } catch (err) {
//     if (err.name && err.name === 'CastError') {
//       return res.sendStatus(404);
//     }
//     res.status(500).json(err);
//   }

//   if (!error) {
//     const newLogistics = new Logistics(req.body);
//     newLogistics.save();
//     return res.status(201).send({
//       message: 'Successfully created a new logistics',
//     });
//   }
//   const err = [];
//   err.push({ msg: error.message });
//   return res.status(500).send({
//     error: err,
//   });
// };

module.exports = {
  GET_ALL_LOGISTICS,
  GET_LOGISTICS_BY_ORGANIZATION,
  GET_LOGISTICS_BY_ORGANIZATION_FOR_REPORT,
  GET_SPECIFIC_LOGISTICS,
  ADD_NEW_LOGISTICS,
  UPDATE_LOGISTIC,
  GET_TODAY_SCHEDULE,
  GET_SCHEDULE_BY_DATE,
  DELETE_LOGISTIC,
  ADD_ITEMS_TO_LOGISTICS,
  UPDATE_ITEM,
  DELETE_ITEM,
  GET_COMMON_ITEMS_FOUND_FOR_SPECIFIC_ORGANIZATION,
  // ADD_OPERATION_TEAM_TO_LOGISTICS,
};
