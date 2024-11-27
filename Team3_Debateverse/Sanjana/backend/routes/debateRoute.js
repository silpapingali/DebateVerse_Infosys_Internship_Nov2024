const express= require("express");
const {Debatelist} = require("../controllers/Debates");
const {Authjwt} = require("../middlewares/Authjwt");

const DebateRoutes= express.Router();

DebateRoutes.get("/list", Authjwt, Debatelist);

module.exports=  DebateRoutes;