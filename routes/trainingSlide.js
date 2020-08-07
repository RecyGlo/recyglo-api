const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');
const trainingSlideController = require('../controllers/trainingSlide');

router.get('/:id', auth.checkAuth, trainingSlideController.GET_SPECIFIC_TRAINING_SLIDE);
router.get('/', auth.checkAuth, trainingSlideController.GET_ALL_TRAINING_SLIDES);
router.post('/', auth.checkAuth, trainingSlideController.ADD_NEW_TRAINING_SLIDE);
router.patch('/:id', auth.checkAuth, trainingSlideController.UPDATE_TRAINING_SLIDE);
router.delete('/:id', auth.checkAuth, trainingSlideController.DELETE_TRAINING_SLIDE);

module.exports = router;
