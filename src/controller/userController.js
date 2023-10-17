const User = require("../models/user");
const {
  passwordencrypt,
  validatePassword,
} = require("../services/commonServices");

const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");

exports.SignUp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    username =   name.replace(/\s/g, "").toLowerCase() + Math.floor(Math.random().toFixed(2) * 100);

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Required fields are missing.",
      });
    }

    const checkEmail = await User.findOne({ where: { email } });
    const checkPhone = await User.findOne({ where: { phone } });

    if (checkEmail || checkPhone) {
      const message = checkEmail
        ? "Email is already in use."
        : "Phone number is already in use.";
      res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message,
      });
    } else {
      if (!validatePassword(password)) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: "responsemessage.VALIDATEPASS",
        });
      } else {
        const hashpassword = await passwordencrypt(password);

        const user = await User.create({
          name,
          email,
          phone,
          password:hashpassword,
        });

        return res.status(201).json({
          status: StatusCodes.CREATED,
          message: "Successfully registered",
          UserData: user,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
    });
  }
};
