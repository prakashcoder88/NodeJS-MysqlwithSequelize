const express = require("express")
const router = express.Router()

const {
    Register
} = require("../controller/user")



router.route("/register").post(Register);




module.exports = router;