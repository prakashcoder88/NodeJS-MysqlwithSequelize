const config = require("../config/DbConfig")
const jwt = require("jsonwebtoken")
const bcrypt = require ("bcrypt")
const {StatusCodes} = require("http-status-codes")
const db = require("../models/user")
const User = db.user

exports.Register = async (req, res) => {
    try {
      let { username, email, phone, password} = req.body;
  
      if (!username || !email || !phone) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: "MessageRespons.required",
        });
      } else if (!validatePassword(password)) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: "MessageRespons.passwordvalidate",
        });
      } else {
        const checkemail = await db.findOne({ email });
        const checkphone = await db.findOne({ phone });
  
        if (checkemail || checkphone) {
          const message = checkemail
            ? "MessageRespons.checkemail"
            : "MessageRespons.checkphone";
  
          res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message,
          });
        } else {

  
          password = await passwordencrypt(password);

          let user = new db({
            username,
            email,
            phone,
            password,
     
           
          });
  
          user.save().then((data, err) => {
            if (err) {
              return res.status(400).json({
                status: StatusCodes.BAD_REQUEST,
                message: "Not Register User",
              });
            } else {
              return res.status(201).json({
                status: StatusCodes.CREATED,
                message: "Successfully Register",
                UserData: data,
              });
            }
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
  