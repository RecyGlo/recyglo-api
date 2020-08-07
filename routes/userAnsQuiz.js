const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');
const userAnsQuizController = require('../controllers/userAnsQuiz');

router.get('/:id', auth.checkAuth, userAnsQuizController.GET_SPECIFIC_USER_ANS_QUIZ);
router.get('/', auth.checkAuth, userAnsQuizController.GET_ALL_USER_ANS_QUIZZES);
router.post('/', auth.checkAuth, userAnsQuizController.ADD_NEW_USER_ANS_QUIZ);
router.patch('/:id', auth.checkAuth, userAnsQuizController.UPDATE_USER_ANS_QUIZ);
router.delete('/:id', auth.checkAuth, userAnsQuizController.DELETE_USER_ANS_QUIZ);

module.exports = router;
