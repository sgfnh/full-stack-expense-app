const express= require('express');
const router = express.Router();

const userAuthentication = require('../middleware/mid')
const reportsController = require('../controller/reportsC')

router.post('/getDailyReportList',userAuthentication.authenticate,reportsController.downloadDailyLinkGet)
router.post('/getMonthlyReportList',userAuthentication.authenticate,reportsController.downloadMonthlyLinkGet)

module.exports=router;