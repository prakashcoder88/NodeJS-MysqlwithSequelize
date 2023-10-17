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
  },
  username: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  phone: {
    type: Sequelize.STRING,
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
