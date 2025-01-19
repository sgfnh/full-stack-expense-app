const sequelize=require('../util/db')
const Sequelize=require('sequelize')
const expenseM=sequelize.define('Expense',{
    
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    date:{
        type:Sequelize.STRING
    },
    category: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    amount: {
        type: Sequelize.INTEGER
    }
   
})
module.exports=expenseM;