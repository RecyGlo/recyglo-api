const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');
const serviceController = require('../controllers/service');

router.get('/:id', auth.checkAuth, serviceController.GET_SPECIFIC_SERVICE);
router.get('/', auth.checkAuth, serviceController.GET_ALL_SERVICES);

module.exports = router;
