const config = require("../config/DbConfig");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

const db ={};

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require("./user"),(Sequelize, sequelize)

module.exports = db


