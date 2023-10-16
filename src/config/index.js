const config = require("./DbConfig")
const { Sequelize, DataTypes} = require("sequelize")

const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password
)