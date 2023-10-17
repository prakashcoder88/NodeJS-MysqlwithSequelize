const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/Db.Config");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username:{
    type:Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: Sequelize.STRING,
  },

  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

// User.sync()
// User.sync({alter: true})

module.exports = User;
