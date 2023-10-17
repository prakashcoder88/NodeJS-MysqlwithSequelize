const express = require("express");
const router = express.Router()

const Userdata = require("../controller/userController");


router.post("/signup", Userdata.SignUp)


module.exports = router