const express = require('express');
const Authroute = express.Router();
const { RegisterValidate, LoginValidate } = require('../middlewares/AuthValidation');
const {Login, Register, ResetPassword, Verify} = require('../controllers/Auth');

Authroute.post('/login', LoginValidate, Login)
Authroute.post('/register', RegisterValidate, Register);
Authroute.post('/resetpassword', ResetPassword);
Authroute.get('/register/verify', Verify);

module.exports = Authroute;