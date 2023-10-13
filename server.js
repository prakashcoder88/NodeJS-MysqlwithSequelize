const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

require("dotenv").config()
const PORT = process.env.SERVERPORT || 6000


const app = express()

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))


app.listen(PORT, () =>{
    console.log(`Successfully running port on ${PORT}`);
})