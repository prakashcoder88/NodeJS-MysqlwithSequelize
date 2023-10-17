const express = require("express");
const router = express.Router()

const Userdata = require("../controller/userController");


router.post("/signup", Userdata.SignUp)
router.post("/signin", Userdata.SignIn)
router.get("/userfind", Userdata.userFind)


module.exports = router