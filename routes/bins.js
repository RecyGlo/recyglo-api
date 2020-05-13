const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');
const binController = require('../controllers/bin');

router.get('/:id', auth.checkAuth, binController.GET_SPECIFIC_BIN);
router.get('/', auth.checkAuth, binController.GET_ALL_BINS);
router.post('/', auth.checkAuth, binController.ADD_NEW_BIN);
router.patch('/:id', auth.checkAuth, binController.UPDATE_BIN);
router.delete('/:id', auth.checkAuth, binController.DELETE_BIN);

module.exports = router;
