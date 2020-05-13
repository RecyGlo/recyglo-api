const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');
const logisticsController = require('../controllers/logistics');

router.get('/', auth.checkAuth, logisticsController.GET_ALL_LOGISTICS);
router.get('/organizations/:id', auth.checkAuth, logisticsController.GET_LOGISTICS_BY_ORGANIZATION);
router.get('/reports/organizations/:id', auth.checkAuth, logisticsController.GET_LOGISTICS_BY_ORGANIZATION_FOR_REPORT);
router.get('/today', auth.checkAuth, logisticsController.GET_TODAY_SCHEDULE);
router.get('/date/:date', auth.checkAuth, logisticsController.GET_SCHEDULE_BY_DATE);
router.get('/:id', auth.checkAuth, logisticsController.GET_SPECIFIC_LOGISTICS);
router.post('/', auth.checkAuth, logisticsController.ADD_NEW_LOGISTICS);
router.patch('/:id', auth.checkAuth, logisticsController.UPDATE_LOGISTIC);
router.delete('/:id', auth.checkAuth, logisticsController.DELETE_LOGISTIC);
router.post('/add_item/:id', auth.checkAuth, logisticsController.ADD_ITEMS_TO_LOGISTICS);
router.patch('/update_item/:id', auth.checkAuth, logisticsController.UPDATE_ITEM);
router.delete('/:logisticsId/:itemId', auth.checkAuth, logisticsController.DELETE_ITEM);
router.delete('/:logisticsId/:itemId', auth.checkAuth, logisticsController.DELETE_ITEM);
router.get('/organizations/items_found/:id', auth.checkAuth, logisticsController.GET_COMMON_ITEMS_FOUND_FOR_SPECIFIC_ORGANIZATION);
module.exports = router;
