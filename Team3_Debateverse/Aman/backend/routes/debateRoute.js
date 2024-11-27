const express= require("express");
const {Debatelist, CreateDebate } = require("../controllers/Debates");
const {Authjwt} = require("../middlewares/Authjwt");

const DebateRoutes= express.Router();

DebateRoutes.get("/list", Authjwt, Debatelist);
DebateRoutes.post("/create", CreateDebate);

module.exports=  DebateRoutes;