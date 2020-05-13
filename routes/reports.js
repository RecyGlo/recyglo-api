const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');
const { getReportDetail, GET_SPECIFIC_REPORT, ADD_NEW_REPORT } = require('../controllers/report');

// router.route('/').get(getReportDetail);
// router.get('/:id', auth.checkAuth, productController.GET_SPECIFIC_PRODUCT);
router.get('/', getReportDetail);
router.get('/:id', GET_SPECIFIC_REPORT);
router.post('/', auth.checkAuth, ADD_NEW_REPORT);

// module.exports = (app) => {
//   app.use('/reports', router);
// };

module.exports = router;
