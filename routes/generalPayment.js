const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');
const generalPaymentController = require('../controllers/generalPayment');

router.get('/:id', auth.checkAuth, generalPaymentController.GET_SPECIFIC_PAYMENT);
router.get('/', auth.checkAuth, generalPaymentController.GET_ALL_PAYMENTS);
router.post('/', auth.checkAuth, generalPaymentController.ADD_NEW_PAYMENT);
router.patch('/:id', auth.checkAuth, generalPaymentController.UPDATE_PAYMENT);
router.delete('/:id', auth.checkAuth, generalPaymentController.DELETE_PAYMENT);
router.post('/2c2p_redirect', generalPaymentController.TwoCTwoPRedirect);

module.exports = router;
