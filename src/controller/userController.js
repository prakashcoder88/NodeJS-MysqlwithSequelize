const User = require("../models/user");
const responsemessage = require("../utils/responseMessage.json");
const {
  passwordencrypt,
  validatePassword,
} = require("../services/commonServices");
const genratejwt = require("../utils/jwt");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");

exports.SignUp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    username =
      name.replace(/\s/g, "").toLowerCase() +
      Math.floor(Math.random().toFixed(2) * 100);

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: responsemessage.REQUIRED,
      });
    }

    const checkEmail = await User.findOne({ where: { email } });
    const checkPhone = await User.findOne({ where: { phone } });

    if (checkEmail || checkPhone) {
      const message = checkEmail
        ? responsemessage.EMAILEXITS
        : responsemessage.PHONEEXITS;
      res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message,
      });
    } else {
      if (!validatePassword(password)) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: responsemessage.VALIDATEPASS,
        });
      } else {
        const hashpassword = await passwordencrypt(password);

        const user = await User.create({
          username,
          name,
          email,
          phone,
          password: hashpassword,
        });

        return res.status(201).json({
          status: StatusCodes.CREATED,
          message: responsemessage.CREATED,
          UserData: user,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.SignIn = async (req, res) => {
  try {
    const { masterfield, password } = req.body;

    let user = await User.findOne({
      where: {
        [Sequelize.Op.or]: [
          { username: masterfield },
          { email: masterfield },
          { phone: masterfield },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        message: responsemessage.UNAUTHORIZED,
      });
    } else {
      const passwordvalidate = await bcrypt.compare(password, user.password);

      if (!passwordvalidate) {
        return res.status(401).json({
          status: StatusCodes.UNAUTHORIZED,
          message: "User password not match",
        });
      } else {
        const { err, token } = await genratejwt({
          id: user.id,username:user.username
        });
        if (err) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: responsemessage.TOKENNOTCREATE,
          });
        } else {
          return res.status(200).json({
            status: StatusCodes.OK,
            success: true,
            accesstoken: token,
            message: responsemessage.LOGINSUCCESS,
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.userFind = async(req, res) =>{
    try {
        const userId = req.currentuser;

        const user = await User.findOne({userId})
        
        if(!user){
            return res.status(401).json({
                status:StatusCodes.UNAUTHORIZED,
                message:responsemessage.UNAUTHORIZED
            })
        }else {
            return res.status(200).json({
                status:StatusCodes.OK,
                message:"user details found",
                user
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: responsemessage.INTERNAL_SERVER_ERROR,
          });
    }
}
