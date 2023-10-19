const express = require("express");
const router = express.Router()

const Userdata = require("../controller/userController");
const {UserToken} =require("../middleware/auth")


router.post("/signup", Userdata.SignUp)
router.post("/signin", Userdata.SignIn)
router.get("/userfind", Userdata.userFind)
router.patch("/softdelete", UserToken,Userdata.SoftDelete)


module.exports = router