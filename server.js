const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

require("dotenv").config()
const PORT = process.env.SERVERPORT || 6000


// const database = require("./src/config/DbConfig")
const db = require("./src/models/user")
// db.sequelize.sync()
const userRoute = require("./src/routes/userRoutes")


const app = express()

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use("/user", userRoute)

app.listen(PORT, () =>{
    console.log(`Successfully running port on ${PORT}`);
})