const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');
const productController = require('../controllers/product');

router.get('/:id', auth.checkAuth, productController.GET_SPECIFIC_PRODUCT);
router.get('/', auth.checkAuth, productController.GET_ALL_PRODUCTS);

module.exports = router;
