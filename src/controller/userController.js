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
const { Sequelize, Op } = require("sequelize");

// exports.SignUp = async (req, res) => {
//   try {
//     const { name, email, phone, password, referrer } = req.body;

//     const username =
//       name.replace(/\s/g, "").toLowerCase() +
//       Math.floor(Math.random().toFixed(2) * 100);

//     if (!name && !email && !phone && !password && !referrer) {
//       return res.status(400).json({
//         status: StatusCodes.BAD_REQUEST,
//         message: responsemessage.REQUIRED,
//       });
//     }

//     const checkEmail = await User.findOne({ where: { email } });
//     const checkPhone = await User.findOne({ where: { phone } });

//     if (checkEmail && checkPhone) {
//       const message = checkEmail
//         ? responsemessage.EMAILEXISTS
//         : responsemessage.PHONEEXISTS;
//       return res.status(400).json({
//         status: StatusCodes.BAD_REQUEST,
//         message,
//       });
//     } else {
//       const referrerUser = await User.findOne({
//         where: { referralCode: referrer },
//       });
//       if (!referrerUser) {
//         return res.status(400).json({
//           status: StatusCodes.BAD_REQUEST,
//           message: "Invalid referral code.",
//         });
//       }
//       const referrerId = referrerUser.id;

//       if (!validatePassword(password)) {
//         return res.status(400).json({
//           status: StatusCodes.BAD_REQUEST,
//           message: responsemessage.VALIDATEPASS,
//         });
//       } else {
//         const hashPassword = await passwordencrypt(password);
//         const newUser = await User.create({
//           username,
//           name,
//           email,
//           phone,
//           referrer,
//           referralCode: referralCode(8),
//           referrerby: referrerId,
//           password: hashPassword,
//         });

//         return res.status(201).json({
//           status: StatusCodes.CREATED,
//           message: responsemessage.CREATED,
//           UserData: newUser,
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

// exports.userUpdate = async (req, res) => {
//   try {
//     const { email, phone } = req.body;

//     const useremail = email ? email.toLowerCase() : undefined;

//     let checkemail = await User.findOne({
//       email,
//       _id: { $ne: req.currentuser },
//     });
//     let checkphone = await User.findOne({
//       phone,
//       _id: { $ne: req.currentuser },
//     });

//     if (checkemail || checkphone) {
//       const message = checkemail
//         ? responsemessage.EMAILEXITS
//         : responsemessage.PHONEEXITS;

//       res.status(400).json({
//         status: StatusCodes.BAD_REQUEST,
//         message,
//       });
//     } else {
//       let user = await User.findByID({ id: req.currentUser });
//       if (!user) {
//         return res.status(400).json({
//           status: StatusCodes.BAD_REQUEST,
//           message: responsemessage.NOTFOUND,
//         });
//       } else {
//         let user = {
//           email: useremail,
//           phone,
//         };
//         const userUpdate = await User.findByIdAndUpdate(
//           { id: req.currentUser },
//           { $set: user },
//           { new: true }
//         );
//         res.status(200).json({
//           status: StatusCodes.OK,
//           message: "User details update",
//         });
//       }
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status: StatusCodes.INTERNAL_SERVER_ERROR,
//       message: responsemessage.INTERNAL_SERVER_ERROR,
//     });
//   }
// };

exports.userSignUpOrUpdate = async (req, res) => {
  try {
    const {
      id,
      name,
      email,
      phone,
      password,
      referrer,
      email: updateEmail,
      phone: updatePhone,
    } = req.body;

    if (id) {
      // Update an existing user
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          status: StatusCodes.NOT_FOUND,
          message: "User not found.",
        });
      }

      const updateRequest = Boolean(updateEmail || updatePhone);

      if (updateRequest) {
        const useremail = updateEmail ? updateEmail.toLowerCase() : undefined;

        const checkemail = await User.findOne({
          where: {
            email: useremail,
            id: { [Op.not]: id },
          },
        });

        const checkphone = await User.findOne({
          where: {
            phone: updatePhone,
            id: { [Op.not]: id },
          },
        });

        if (checkemail || checkphone) {
          const message = checkemail
            ? responsemessage.EMAILEXITS
            : responsemessage.PHONEEXITS;

          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message,
          });
        } else {
          const userUpdate = {
            email: useremail,
            phone: updatePhone,
          };

          await user.update(userUpdate);
          return res.status(200).json({
            status: StatusCodes.OK,
            message: "User details updated",
          });
        }
      }
    } else {
      // Create a new user
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
          ? responsemessage.EMAILEXITS
          : responsemessage.PHONEEXITS;
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
          const username =
            name.replace(/\s/g, "").toLowerCase() +
            Math.floor(Math.random().toFixed(2) * 100);
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
    }
  } catch (error) {
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

exports.changePassword = async (req, res) => {
  try {
    const userId = req.currentuser;

    // const user = await User.findOne({ where: { id: req.currentuser } });
    const user = await User.findByPk(userId);

    let { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(403).json({
        status: StatusCodes.FORBIDDEN,
        message: "Filed are required",
      });
    } else if (!validatePassword(newPassword)) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Password not validate",
      });
    } else if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: "New password and Confirm password not match",
      });
    } else {
      const samePassword = await bcrypt.compare(oldPassword, user.password);

      if (!samePassword) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: "Old password not match",
        });
      } else {
        const newSamePassword = await bcrypt.compare(
          newPassword,
          user.password
        );

        if (newSamePassword) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: "Old password and New Password are same ",
          });
        } else {
          const passwordHash = await passwordencrypt(
            newPassword,
            user.password
          );

          const userUpdate = await user.update({ password: passwordHash });

          return res.status(200).json({
            status: StatusCodes.OK,
            message: "Password successfully changed",
            user: userUpdate,
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

exports.resetPassword = async (req, res) => {
  try {
    const { newpassword, confirmpassword } = req.body;

    if (!newpassword || !confirmpassword) {
      return res.status(403).json({
        status: StatusCodes.FORBIDDEN,
        message: "All filed required",
      });
    } else if (!validatePassword(newpassword)) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: responsemessage.VALIDATEPASS,
      });
    } else {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({
          status: StatusCodes.NOT_FOUND,
          message: responsemessage.NOTFOUND,
        });
      } else {
        if (newpassword !== confirmpassword) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: "Password not match",
          });
        } else if (
          user.otpExpire <
          new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })
        ) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: "Otp session time out",
          });
        } else {
          const passwordHash = await passwordencrypt(newpassword);

          const userUpdate = await user.update(
            { password: passwordHash },
            {
              where: { id: user.id },
            }
          );
          console.log(userUpdate);
          if (userUpdate[0] === 1) {
            return res.status(200).json({
              status: StatusCodes.OK,
              message: "Password successfully changed",
            });
          } else {
            return res.status(500).json({
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              message: "Password update failed",
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
// exports.forgotPassword = async (req, res) => {
//   try {
//     let { email } = req.body;

//     const otp = Math.floor(1000 * Math.random() * 9000);
//     if (!email) {
//       return res.status(400).json({
//         status: StatusCodes.BAD_REQUEST,
//         message: "Enter your email id",
//       });
//     } else {
//       let user = await User.findByPk({ email });

//       if (!user) {
//         return res.status(400).json({
//           status: StatusCodes.BAD_REQUEST,
//           message: "We check your email id not found in our system",
//         });
//       } else {
//         let emailResponse = await sendEmail(user.email, otp);

//         if (emailResponse.error) {
//           return res.status(503).json({
//             status: StatusCodes.SERVICE_UNAVAILABLE,
//             message: responsemessage.SERVICE_UNAVAILABLE,
//           });
//         } else {
//           let expiretime = Date.now() + 2 * 60 * 1000;
//           let expiretimeIST = new Date(expiretime).toLocaleString("en-IN", {
//             timeZone: "Asia/Kolkata",
//           });
//           const userOtpExpire = await User.findByIdAndUpdate(
//             { id: user.id },
//             { $set: { otp: otp, otpExpire: expiretimeIST } },
//             { new: true }
//           );
//         }
//       }
//       return res.status(200).json({
//         status:StatusCodes.OK,
//         message: "We send email for otp",
//         otp:otp
//       })
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status: StatusCodes.INTERNAL_SERVER_ERROR,
//       message: responsemessage.INTERNAL_SERVER_ERROR,
//     });
//   }
// };


exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    const otp = Math.floor(1000 + Math.random() * 9000); 

    if (!email) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Enter your email id",
      });
    } else {
      let user = await User.findOne({ where: { email } }); 

      if (!user) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: "Email not found in our system", 
        });
      }
      //  else {
      //   let emailResponse = await sendEmail(user.email, otp);

      //   if (emailResponse.error) {
      //     return res.status(503).json({
      //       status: StatusCodes.SERVICE_UNAVAILABLE,
      //       message: "Email service is unavailable", 
      //     });
      //   } 
        else {
          let expiretime = Date.now() + 2 * 60 * 1000;
          let expiretimeIST = new Date(expiretime).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
          const userOtpExpire = await User.update(
            { otp: otp}, //otpExpire: expiretime
            { where: { id: user.id } }
          );
        }
      }
      return res.status(200).json({
        status: StatusCodes.OK,
        message: "Email sent with OTP",
        otp: otp,
      });
    // }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Internal server error", // Corrected the error message
    });
  }
};

exports.verifyOtp = async (req, res) => {
  let { email, otp } = req.body;

  try {
    const user =
      (await User.findOne({where:{ email }})) 
      // (await adminuser.findOne({ empEmail }));

    if (!user) {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: "User not found",
      });
    } else if (otp !== user.otp) {
      return res.status(400).json({
        statust: StatusCodes.BAD_REQUEST,
        message: "Otp not match",
      });
    } else if (
      // user.updateAt  <
      //   Date.now()+ 2 * 60 * 1000
      user.updatedAt.getTime() + 2 * 60 * 1000 < Date.now()
    ) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Otp time Expired",
      });
    } else {
      return res.status(200).json({
        status: StatusCodes.OK,
        message: "Otp successfully verify",
      });
    }
  } catch (error) {

    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
    });
  }
};
