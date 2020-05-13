const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth');
const miscController = require('../controllers/index');
const awsController = require('../controllers/helper');

router.post('/login', authController.LOG_IN);
router.post('/refresh_token', authController.REFRESH_TOKEN);
router.get('/', authController.checkAuth, miscController.GREET);
router.post('/upload', authController.checkAuth, awsController.UPLOAD_TO_S3);
router.get('/dashboard', authController.checkAuth, miscController.GET_DASHBOARD_DATA);
router.get('/dashboard/growth_rate', authController.checkAuth, miscController.GET_GROWTH_RATE_DATA);
router.get('/dashboard/trend', authController.checkAuth, miscController.GET_TRENDLINE_DATA);
router.get('/contract_expries', authController.checkAuth, miscController.GET_CONTRACT_EXPRIES);
router.get('/wastes', authController.checkAuth, miscController.GET_WASTE_DATA);
router.get('/wastes/organizations/:id', authController.checkAuth, miscController.GET_TOTAL_WASTE_BY_ORGANIZATION);
router.get('/wastes/monthly/:id', authController.checkAuth, miscController.GET_WASTE_DATA_BY_ORGANIZATION);
router.get('/wastes/monthly', authController.checkAuth, miscController.GET_MONTHLY_COLLECTED_WASTE_DATA);

module.exports = router;
