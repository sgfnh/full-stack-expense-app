const express=require('express')
const router=express.Router()
const control=require('../controller/expenseC')
const userauthentication = require('../middleware/mid')

router.post('/addexpense', userauthentication.authenticate,control.addexpense)
router.post('/getexpense/:page', userauthentication.authenticate, control.getexpense)
router.get('/deleteexpense/:expenseid', userauthentication.authenticate, control.deleteexpense)

module.exports=router;