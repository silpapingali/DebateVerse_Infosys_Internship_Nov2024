const express= require("express");
const { CreateDebate, AllDebates, MyDebates } = require("../controllers/Debates");
const {Authjwt} = require("../middlewares/Authjwt");

const DebateRoutes= express.Router();

DebateRoutes.get("/alldebates",Authjwt, AllDebates);
DebateRoutes.post("/create", Authjwt, CreateDebate);
DebateRoutes.get("/mydebates",Authjwt, MyDebates);

module.exports=  DebateRoutes;