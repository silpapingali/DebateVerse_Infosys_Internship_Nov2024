const express = require('express');
const Authroute = express.Router();
const { RegisterValidate, LoginValidate } = require('../middlewares/AuthValidation');
const {Login, Register, ResetPassword} = require('../controllers/Auth');

Authroute.post('/login', LoginValidate, Login)
Authroute.post('/register', RegisterValidate, Register);
Authroute.post('/resetpassword', ResetPassword);

module.exports = Authroute;