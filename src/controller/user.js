const config = require("../config/DbConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");


exports.Register = async (req, res) => {
  try {
    const { id,username, email, phone, password } = req.body;

    if (!username || !email || !phone) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: "MessageRespons.required",
      });
    } 
    // else if (!validatePassword(password)) {
    //   return res.status(400).json({
    //     status: StatusCodes.BAD_REQUEST,
    //     message: "MessageRespons.passwordvalidate",
    //   });
    // }
     else {
      const checkEmail = await User.findOne({ where: { email } });
      const checkPhone = await User.findOne({ where: { phone } });

      if (checkEmail || checkPhone) {
        const message = checkEmail ? "MessageRespons.checkemail" : "MessageRespons.checkphone";

        res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message,
        });
      } else {
        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        const newuser = await User.create({
          username,
          id,
          email,
          phone,
          password: hashedPassword,
        })
   console.log(newuser)
        .then((newuser) => {
            res.status(201).json({
              status: StatusCodes.CREATED,
              message: "Successfully Register",
              UserData: newuser,
            });
          })
          .catch((err) => {
            res.status(400).json({
              status: StatusCodes.BAD_REQUEST,
              message: "Not Register User",
            });
          });
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "MessageRespons.internal_server_error",
    });
  }
};
