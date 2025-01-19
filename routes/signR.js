const express=require('express')
const router=express.Router()
const contro=require('../controller/signC')
const expenseController=require('../controller/expenseC')
const userAuthentication = require("../middleware/mid");

router.post('/sign',contro.addD)
router.post('/login',contro.login)
router.get('/download', userAuthentication.authenticate, expenseController.downloadexpense)
router.get('/isPremiumUser', userAuthentication.authenticate, contro.isPremiumUser)

module.exports=router;