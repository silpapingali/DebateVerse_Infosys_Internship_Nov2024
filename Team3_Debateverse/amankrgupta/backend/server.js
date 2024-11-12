const express= require("express");
const app= express();
require('dotenv').config();
const db = require('./database/db')
const Authroute = require('./routes/authRoutes')
const cors = require('cors')

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());
// databse connection
db();

app.use('/api/auth',Authroute)

app.listen(process.env.PORT,()=>{
    console.log("server started");
})