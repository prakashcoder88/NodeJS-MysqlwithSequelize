const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize()
const User = sequelize.define("user", {
    name:DataTypes.TEXT,
    age:DataTypes.INTEGER,
    email:DataTypes.TEXT
    
})
(async () =>{
    await sequelize.sync({force:true})
})