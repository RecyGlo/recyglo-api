const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');
const productController = require('../controllers/product');

router.get('/:id', auth.checkAuth, productController.GET_SPECIFIC_PRODUCT);
router.get('/', auth.checkAuth, productController.GET_ALL_PRODUCTS);
router.post('/', auth.checkAuth, productController.ADD_NEW_PRODUCT);
router.patch('/:id', auth.checkAuth, productController.UPDATE_PRODUCT);
router.delete('/:id', auth.checkAuth, productController.DELETE_PRODUCT);

module.exports = router;
