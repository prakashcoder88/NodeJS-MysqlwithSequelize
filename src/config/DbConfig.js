// require("dotenv").config();
// const { Sequelize, DataTypes, Op } = require("sequelize");

// const { HOST, PORT, USER, PASSWORD, DATABASE, DIALECT } = process.env;

// const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
//   dialect: DIALECT,
//   host: HOST,
//   port: PORT, 
// });

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.User = require("../models/user.js")(sequelize, DataTypes); // Use DataTypes, not Sequelize
// //db.Product = require("../models/product.js")(sequelize, DataTypes); // Use DataTypes, not Sequelize
// //db.Order = require("../models/order.js")(sequelize, DataTypes); // Use DataTypes, not Sequelize

// module.exports = db;

require("dotenv").config();


const { HOST, PORT, USER, PASSWORD, DATABASE, DIALECT } = process.env;
module.exports = {
    db:{
        host : HOST,
        user : USER,
        password: PASSWORD,
        database :DATABASE,
        dialect : DIALECT
    }
}
