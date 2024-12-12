const express = require('express');
const { RegisterValidate, LoginValidate, ResetPasswordValidate } = require('../middlewares/AuthValidation');
const {Login, Register, ResetPassword, Verify, ResetRequest} = require('../controllers/Auth');
const Authroute = express.Router();

Authroute.post('/login', LoginValidate, Login)
Authroute.post('/register', RegisterValidate, Register);
Authroute.post('/resetpassword',ResetPasswordValidate, ResetPassword);
Authroute.post('/resetrequest', ResetRequest);
Authroute.get('/register/verify', Verify);

module.exports = Authroute;