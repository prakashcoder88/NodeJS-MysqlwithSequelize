const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");

require("../controller/userController");

const { jwt_secretkey } = process.env;

const UserToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({
      status: StatusCodes.FORBIDDEN,
      message: "Unauthorized",
    });
  }
  try {
    const decoded = jwt.verify(authHeader, jwt_secretkey);
    req.req.currentuser = decoded;
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
