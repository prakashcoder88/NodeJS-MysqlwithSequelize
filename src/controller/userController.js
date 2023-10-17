const User = require("../models/user")


const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');



exports.SignUp = async (req, res) => {
  try {
    const { name, email, phone, age, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: 'Required fields are missing.',
      });
    }

    const checkEmail = await User.findOne({ where: { email } });
    const checkPhone = await User.findOne({ where: { phone } });

    if (checkEmail || checkPhone) {
      const message = checkEmail ? 'Email is already in use.' : 'Phone number is already in use.';
      res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message,
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        phone,
        age,
        password: hashedPassword,
      });

      return res.status(201).json({
        status: StatusCodes.CREATED,
        message: 'Successfully registered',
        UserData: user,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
};
