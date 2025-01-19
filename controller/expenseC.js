const Expense=require('../model/expenseM')
const User=require('../model/signM')
const sequelize=require('../util/db')
const UserServices = require("../services/userServices")
const S3Service = require('../services/S3service')
const reports=require("../model/reports")
const addexpense=async (req,res,next)=>{
    const t = await sequelize.transaction();

    try {
        const { amount, description, category,date } = req.body;
        await Expense.create({
            date:date,
            amount: amount,
            description: description,
            category: category,
            signUpId: req.signUp.id
        }, { transaction: t });
        await User.update({
            totalExpenses: Number(req.signUp.totalExpenses) + Number(amount),
        },
            { where: { id: req.signUp.id }, transaction: t },

        )
        await t.commit();
        res.status(200).json({ message: "Expenses added" });

    } catch (err) {
        console.log(err)
        res.status(500).json({success:false,error:err})

    }

}
const getexpense=async (req,res)=>{
   console.log(">>>>>>>limit",req.body);
    try {
        const pageNo = req.params.page;
        const limit = Number(req.body.limit);
        const offset = (pageNo - 1) * limit;
        const totalExpenses = await Expense.count({
            where: { signUpId: req.signUp.id }
        });
        const totalPages = Math.ceil(totalExpenses / limit);

        const expense = await Expense.findAll({
            where: { signUpId: req.signUp.id },
            offset: offset,
            limit: limit
        })

        res.json({expense:expense,totalPages:totalPages});

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error, success: false })
    }
    
}
const deleteexpense = async (req, res) => {
    
    const t = await sequelize.transaction();


    const id = req.params.expenseid;
  
    try {
        const expense = await Expense.findByPk(id);
        await Expense.destroy({ where: { id: id, signUpId: req.signUp.id }, transaction: t })
        await User.update({
            totalExpenses: Number(req.signUp.totalExpenses) - Number(expense.amount),
        },
            { where: { id: req.signUp.id }, transaction: t },

        )
        await t.commit();
        res.status(200).json({ message: "Deleted successfully" })

    }
    catch (err) {
        await t.roolback();
        console.log(err);
        res.status(500).then("Error occured while deleting the expenses")
    }
}
const downloadexpense = async (req, res) => {
        try {
            const expenses = await UserServices.getExpenses(req)
            const stringifiedExpenses = JSON.stringify(expenses);
            console.log(stringifiedExpenses);
            const signUpId = req.signUp.id
    
            //file name should depend on userid
            const filename = `Expense${signUpId}/${new Date()}.txt`
            const fileUrl = await S3Service.uploadToS3(stringifiedExpenses, filename);
            const today = new Date();
    
            let year = today.getFullYear();
            let month = today.getMonth() + 1; // Adding 1 because month is zero-based
            let day = today.getDate();
            month = month < 10 ? `0${month}` : month;
            day = day < 10 ? `0${day}` : day;
    
            const formattedDate = `${year}-${month}-${day}`;
            const formattedMonth = `${year}-${month}`
    
            const response = await reports.create({
                link: fileUrl,
                signUpId: signUpId,
                date: formattedDate,
                month:formattedMonth
    
            })
    
            res.status(200).json({ fileUrl, success: true })
        } catch (err) {
            res.status(500).json({ fileUrl: '', success: false, err: err })
        }
    }


module.exports={addexpense,getexpense,deleteexpense,downloadexpense}