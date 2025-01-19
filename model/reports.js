const Sequelize = require("sequelize");
const sequelize = require("../util/db");


const reports = sequelize.define("reports", {
    link:{
        type:Sequelize.TEXT,
        allowNull:false,
    },
    date:{
        type:Sequelize.STRING,
    },
    month:{
        type:Sequelize.STRING
    }
  
  
}
);

module.exports =reports;