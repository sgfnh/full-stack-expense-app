const express=require("express")
const app=express()

const path=require('path')
const cors=require("cors");
const helmet=require("helmet")
const compression=require("compression")
const morgan=require("morgan")
const fs=require('fs')
const sequelize=require('./util/db')
const dotenv = require('dotenv');
dotenv.config()

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 

app.use(cors())
app.use(helmet())
app.use(compression())

const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})
app.use(morgan('combined',{stream:accessLogStream}))

const rout=require("./routes/signR")
const rout2=require("./routes/expenseR")
const purchaseRoutes=require('./routes/purchase') 
const premiumF=require('./routes/premium')
const resetPasswordRoutes = require('./routes/resetpassword')
const report = require('./routes/reports')
 

app.use('/user',rout)
app.use('/expense',rout2)
app.use('/purchase', purchaseRoutes)
app.use('/premium',premiumF)
app.use('/password', resetPasswordRoutes);
app.use('/reports', report)


const Expense = require('./model/expenseM');
const User = require('./model/signM');
const Order=require('./model/order')
const Forgotpassword = require('./model/forgetpassword');
const Report=require('./model/reports')

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(Report);
Report.belongsTo(User);


app.listen(process.env.PORT)