
const Sequelize = require("sequelize")
require("dotenv").config();


const { HOST, PORT, USER, PASSWORD, DATABASE, DIALECT } = process.env;

const sequelize = new Sequelize( DATABASE, USER, PASSWORD, {
    host: HOST,
    dialect: DIALECT,
  });
  
  module.exports = sequelize;