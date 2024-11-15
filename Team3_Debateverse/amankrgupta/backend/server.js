const express = require("express");
const db = require("./models/db");
const cors = require("cors");
require("dotenv").config();
const Authroute = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set("view engine", "ejs");

db();

app.use("/api/auth", Authroute);

app.listen(process.env.PORT, () => {
  console.log("server started");
});
