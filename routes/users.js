const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');
const userController = require('../controllers/user');

router.post('/log_in', userController.LOG_IN);
router.get('/:id', auth.checkAuth, userController.GET_SPECIFIC_USER);
router.get('/', auth.checkAuth, userController.GET_ALL_USERS);
router.post('/', auth.checkAuth, userController.CREATE_USER);
router.patch('/change_password/:id', auth.checkAuth, userController.CHANGE_PASSWORD);
router.patch('/:id', auth.checkAuth, userController.UPDATE_USER);
router.delete('/:id', auth.checkAuth, userController.DELETE_USER);

module.exports = router;
