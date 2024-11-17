const express = require("express");
const db = require("./models/db");
const cors = require("cors");
require("dotenv").config();
const Authroute = require("./routes/authRoutes");
const { Authjwt } = require("./middlewares/Authjwt");

const app = express();

db();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set("view engine", "ejs");


app.use("/api/auth", Authroute)
app.get("/products",Authjwt,(req, res)=>{
  console.log("welcome to product");
  res.json({message: "welcome to product"});
})

app.listen(process.env.PORT, () => {
  console.log("server started");
});
