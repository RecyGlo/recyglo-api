const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');
const binOrderController = require('../controllers/binOrder');

router.get('/:id', auth.checkAuth, binOrderController.GET_SPECIFIC_BIN_ORDER);
router.get('/', auth.checkAuth, binOrderController.GET_ALL_BIN_ORDERS);
router.post('/', auth.checkAuth, binOrderController.ADD_NEW_BIN_ORDER);
router.patch('/:id', auth.checkAuth, binOrderController.UPDATE_BIN_ORDER);
router.delete('/:id', auth.checkAuth, binOrderController.DELETE_BIN_ORDER);

module.exports = router;
