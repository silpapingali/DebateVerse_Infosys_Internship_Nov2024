const express= require("express");
const { CreateDebate, AllDebates, MyDebates, LikeDebate, VoteDebate, FetchVotes } = require("../controllers/Debates");
const {Authjwt} = require("../middlewares/Authjwt");

const DebateRoutes= express.Router();

DebateRoutes.post("/alldebates",Authjwt, AllDebates);
DebateRoutes.post("/create", Authjwt, CreateDebate);
DebateRoutes.get("/mydebates",Authjwt, MyDebates);
DebateRoutes.get("/likerequest",Authjwt, LikeDebate);
DebateRoutes.post("/voterequest",Authjwt, VoteDebate);
DebateRoutes.get("/fetchvotes",Authjwt, FetchVotes);


module.exports=  DebateRoutes;