// const User = require("../models/user");
// const responsemessage = require("../utils/responseMessage.json");
// const {
//   referralCode,
//   passwordencrypt,
//   validatePassword,
// } = require("../services/commonServices");
// const genratejwt = require("../utils/jwt");
// const { StatusCodes } = require("http-status-codes");
// const bcrypt = require("bcrypt");
// const { Sequelize } = require("sequelize");

// exports.SignUp = async (req, res) => {
//   try {
//     const { name, email, phone, password, referrer } = req.body;

//     username =
//       name.replace(/\s/g, "").toLowerCase() +
//       Math.floor(Math.random().toFixed(2) * 100);

//     if (!name || !email || !phone || !password || !referrer) {
//       return res.status(400).json({
//         status: StatusCodes.BAD_REQUEST,
//         message: responsemessage.REQUIRED,
//       });
//     }

//     const checkEmail = await User.findOne({ where: { email } });
//     const checkPhone = await User.findOne({ where: { phone } });

//     if (checkEmail || checkPhone) {
//       const message = checkEmail
//         ? responsemessage.EMAILEXITS
//         : responsemessage.PHONEEXITS;
//       res.status(400).json({
//         status: StatusCodes.BAD_REQUEST,
//         message,
//       });
//     } else {
//       let referrer =await User.findOne({
//         referralCode = User.referrer
//       })
//       if (!referrer) {
//         return res.status(400).send({
//           error: true,
//           message: "Invalid referral code.",
//         });
//       }
//       let referrerId;
//       referrerId = referrer._id;

//       if (!validatePassword(password)) {
//         return res.status(400).json({
//           status: StatusCodes.BAD_REQUEST,
//           message: responsemessage.VALIDATEPASS,
//         });
//       } else {
//         const hashpassword = await passwordencrypt(password);
//         // referralCode = referralCode(8)

//         const user = await User.create({
//           username,
//           name,
//           email,
//           phone,
//           referrer,
//           referralCode:referralCode(8),
//           referrerby:referrerId,
//           password: hashpassword,
//         });

//         return res.status(201).json({
//           status: StatusCodes.CREATED,
//           message: responsemessage.CREATED,
//           UserData: user,
//         });
//       }
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: StatusCodes.INTERNAL_SERVER_ERROR,
//       message: responsemessage.INTERNAL_SERVER_ERROR,
//     });
//   }
// };

const User = require("../models/user");
const responsemessage = require("../utils/responseMessage.json");
const {
  referralCode,
  passwordencrypt,
  validatePassword,
} = require("../services/commonServices");
const genratejwt = require("../utils/jwt");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");

exports.SignUp = async (req, res) => {
  try {
    const { name, email, phone, password, referrer } = req.body;

    const username =
      name.replace(/\s/g, "").toLowerCase() +
      Math.floor(Math.random().toFixed(2) * 100);

    if (!name || !email || !phone || !password || !referrer) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: responsemessage.REQUIRED,
      });
    }

    const checkEmail = await User.findOne({ where: { email } });
    const checkPhone = await User.findOne({ where: { phone } });

    if (checkEmail || checkPhone) {
      const message = checkEmail
        ? responsemessage.EMAILEXISTS
        : responsemessage.PHONEEXISTS;
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message,
      });
    } else {
      const referrerUser = await User.findOne({
        where: { referralCode: referrer },
      });
      if (!referrerUser) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: "Invalid referral code.",
        });
      }
      const referrerId = referrerUser.id;

      if (!validatePassword(password)) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: responsemessage.VALIDATEPASS,
        });
      } else {
        const hashPassword = await passwordencrypt(password);
        const newUser = await User.create({
          username,
          name,
          email,
          phone,
          referrer,
          referralCode: referralCode(8),
          referrerby: referrerId,
          password: hashPassword,
        });

        return res.status(201).json({
          status: StatusCodes.CREATED,
          message: responsemessage.CREATED,
          UserData: newUser,
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
      if (user.isActive) {
        return res.status(401).json({
          status: StatusCodes.UNAUTHORIZED,
          message: responsemessage.ISACTIVE,
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
            id: user.id,
            // username: user.username,
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
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.userFind = async (req, res) => {
  try {
    const userId = req.currentuser;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        message: responsemessage.UNAUTHORIZED,
      });
    } else {
      return res.status(200).json({
        status: StatusCodes.OK,
        message: "user details found",
        user,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.userUpdate = async (req, res) => {
  try {
    const { email, phone } = req.body;

    const useremail = email ? email.toLowerCase() : undefined;

    let checkemail = await User.findOne({
      email,
      _id: { $ne: req.currentuser },
    });
    let checkphone = await User.findOne({
      phone,
      _id: { $ne: req.currentuser },
    });

    if (checkemail || checkphone) {
      const message = checkemail
        ? responsemessage.EMAILEXITS
        : responsemessage.PHONEEXITS;

      res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message,
      });
    } else {
      let user = await User.findByID({ id: req.currentUser });
      if (!user) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: responsemessage.NOTFOUND,
        });
      } else {
        let user = {
          email: useremail,
          phone,
        };
        const userUpdate = await User.findByIdAndUpdate(
          { id: req.currentUser },
          { $set: user },
          { new: true }
        );
        res.status(200).json({
          status: StatusCodes.OK,
          message: "User details update",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};
exports.SoftDelete = async (req, res) => {
  try {


    const user = await User.findOne({ where: { id: req.currentuser } });

    if (!user) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: responsemessage.NOTFOUND,
      });
    } else {
      user.isActive = true;
      await user.save();
    }
    return res.status(200).json({
      status: StatusCodes.OK,
      message: responsemessage.DELETE,
    });
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: responsemessage.INTERNAL_SERVER_ERROR,
    });
  }
};
