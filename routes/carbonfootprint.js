const express = require('express');

const router = express.Router();
const carbonfootprintController = require('../controllers/carbonfootprint');

router.post('/recycling_calculator', carbonfootprintController.RECYGLING_CALCULATOR);

module.exports = router;
