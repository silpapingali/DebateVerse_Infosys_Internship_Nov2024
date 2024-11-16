const express = require('express');
const Authroute = express.Router();
const { RegisterValidate, LoginValidate, ResetPasswordValidate } = require('../middlewares/AuthValidation');
const {Authjwt} = require("../middlewares/Authjwt");
const {Login, Register, ResetPassword, Verify, ResetRequest} = require('../controllers/Auth');

Authroute.post('/login', LoginValidate, Login)
Authroute.post('/register', RegisterValidate, Register);
Authroute.post('/resetpassword',ResetPasswordValidate, ResetPassword);
Authroute.post('/resetrequest', ResetRequest);
Authroute.get('/register/verify', Verify);

module.exports = Authroute;