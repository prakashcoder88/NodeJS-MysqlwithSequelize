const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const { Sequelize,Op } = require("sequelize");

require("../controller/userController");

const { KEY_TOKEN } = process.env;

const UserToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({
      status: StatusCodes.FORBIDDEN,
      message: "Unauthorized",
    });
  }
  try {
    const decoded = jwt.verify(authHeader, KEY_TOKEN);
    req.currentuser = decoded.id;

  } catch (error) {
    return res.status(403).json({
      status: StatusCodes.FORBIDDEN,
      message: "Unauthorized:Invalid token",
    });
  }
  return next();
};

module.exports ={
    UserToken
}
