const express = require("express");

const Debatelist= (req, res)=>{
    res.status(200).json({message: "this debatelist route"});
}

module.exports={Debatelist};