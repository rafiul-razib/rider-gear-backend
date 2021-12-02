const express = require("express");
const cors = require("cors")
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();


// Middleware
app.use(cors);
app.use(express.json());


app.get('/', (req, res)=>{
    res.send("hello moto")
})

app.listen(port, ()=>{
    console.log("Listening to the port", port)
})