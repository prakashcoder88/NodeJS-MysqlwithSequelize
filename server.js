const express = require("express")
const bodyParser = require("body-parser")
const sequelize = require("sequelize")
const cors = require("cors")

require("dotenv").config()
const PORT = process.env.SERVERPORT || 6000


require("./src/config/Db.Config")
const User = require("./src/models/user")


const userRoute = require("./src/routes/userRoutes")


const app = express()

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use("/api/user", userRoute)

app.listen(PORT, () =>{
    console.log(`Successfully running port on ${PORT}`);
})