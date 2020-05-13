const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');
const trainginController = require('../controllers/training');

router.get('/:id', auth.checkAuth, trainginController.GET_SPECIFIC_TRAINING);
router.get('/', auth.checkAuth, trainginController.GET_ALL_TRAININGS);
router.post('/', auth.checkAuth, trainginController.ADD_NEW_TRAINING);
router.patch('/:id', auth.checkAuth, trainginController.UPDATE_TRAINING);
router.delete('/:id', auth.checkAuth, trainginController.DELETE_TRAINING);

module.exports = router;
