const express= require("express");
const { CreateDebate, GetDebatesbyId, AllDebates } = require("../controllers/Debates");
const {Authjwt} = require("../middlewares/Authjwt");

const DebateRoutes= express.Router();

DebateRoutes.get("/list", AllDebates);
DebateRoutes.post("/create", CreateDebate);
DebateRoutes.get("/getdebatesbyid", GetDebatesbyId);

module.exports=  DebateRoutes;