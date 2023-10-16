
const Sequelize = require("sequelize")
require("dotenv").config();


const { HOST, PORT, USER, PASSWORD, DATABASE, DIALECT } = process.env;

const sequelize = new Sequelize( 'productbase', 'root', 'sa@123', {
    host: 'localhost',
    dialect: 'mysql',
  });
  
  module.exports = sequelize;

  try {
  sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }