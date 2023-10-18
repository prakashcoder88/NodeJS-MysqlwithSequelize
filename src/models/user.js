const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/Db.Config");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },

  password: {
    type: DataTypes.STRING,
  },
  isActive:{
    type:DataTypes.TINYINT
  },

  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

// User.sync()
// User.sync({alter: true})

module.exports = User;
