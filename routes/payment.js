const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');
const paymentController = require('../controllers/payment');

router.get('/', auth.checkAuth, paymentController.GET_ALL_PAYMENTS);
router.get('/:id', auth.checkAuth, paymentController.GET_SPECIFIC_PAYMENT);
router.post('/', auth.checkAuth, paymentController.CREATE_PAYMENT);
router.patch('/:id', auth.checkAuth, paymentController.UPDATE_PAYMENT);
router.get('/organizations/:id', auth.checkAuth, paymentController.GET_PAYMENTS_FOR_SPECIFIC_ORGANIZATION);
router.delete('/:id', auth.checkAuth, paymentController.DELETE_PAYMENT);
router.post('/2c2p', paymentController.TESTPOST);
router.post('/2c2p/get', paymentController.GETPAYMENTACTION);

module.exports = router;
