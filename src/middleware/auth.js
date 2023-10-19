const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");

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
    console.log(decoded);
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

// const jwt = require("jsonwebtoken");
// const { StatusCodes } = require("http-status-codes");
// const User = require("../models/user");

// Remove this line as it's unnecessary
// require("../controller/userController");

// const { jwt_secretkey } = process.env;

// const UserToken = async (req, res, next) => {
//   const authHeader = req.headers["authorization"];

//   if (!authHeader) {
//     return res.status(403).json({
//       status: StatusCodes.FORBIDDEN,
//       message: "Unauthorized",
//     });
//   }

//   try {
//     const token = authHeader.split(" ")[1]; // Remove "Bearer " from the token
//     const decoded = jwt.verify(token, jwt_secretkey);

//     const user = await User.findOne({ where: { id: decoded.id } });
//     console.log(user);
//     if (!user) {
//       return res.status(403).json({
//         status: StatusCodes.FORBIDDEN,
//         message: "Unauthorized: User not found",
//       });
//     }

//     req.currentuser = user;
//     return next();
//   } catch (error) {
//     return res.status(403).json({
//       status: StatusCodes.FORBIDDEN,
//       message: "Unauthorized: Invalid token",
//     });
//   }
// };

// module.exports = {
//   UserToken,
// };
