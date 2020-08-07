const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');
const quizController = require('../controllers/quiz');

router.get('/:id', auth.checkAuth, quizController.GET_SPECIFIC_QUIZ);
router.get('/', auth.checkAuth, quizController.GET_ALL_QUIZZES);
router.post('/', auth.checkAuth, quizController.ADD_NEW_QUIZ);
router.patch('/:id', auth.checkAuth, quizController.UPDATE_QUIZ);
router.delete('/:id', auth.checkAuth, quizController.DELETE_QUIZ);

module.exports = router;
