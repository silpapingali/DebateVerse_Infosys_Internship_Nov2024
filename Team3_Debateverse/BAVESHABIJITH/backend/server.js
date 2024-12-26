const express = require("express");
const db = require("./models/db");
const cors = require("cors");
require("dotenv").config();
const Authroute = require("./routes/authRoutes");
const DebateRoute= require("./routes/debateRoute")
const AdminRoute = require("./routes/adminRoutes");

const app = express();

db();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set("view engine", "ejs");

app.use("/api/auth", Authroute);
app.use("/api/debates", DebateRoute);
app.use("/api/admin", AdminRoute);

app.listen(process.env.PORT, () => {
  console.log("server started");
});
