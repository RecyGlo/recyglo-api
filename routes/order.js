const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');
const orderController = require('../controllers/order');

router.get('/:id', auth.checkAuth, orderController.GET_SPECIFIC_ORDER);
router.get('/', auth.checkAuth, orderController.GET_ALL_ORDERS);
router.post('/', orderController.ADD_NEW_ORDER);
router.patch('/:id', auth.checkAuth, orderController.UPDATE_ORDER);
router.delete('/:id', auth.checkAuth, orderController.DELETE_ORDER);

module.exports = router;
