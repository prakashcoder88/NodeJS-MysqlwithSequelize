const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../config/DbConfig")

  const User = sequelize.define("user", {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
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
  });

  module.exports = User;

