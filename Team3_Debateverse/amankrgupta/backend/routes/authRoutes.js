const express = require('express');
const Authroute = express.Router();
const { RegisterValidate, LoginValidate } = require('../middlewares/AuthValidation');
const {Login, Register} = require('../controllers/Auth');

Authroute.post('/login', LoginValidate, Login)
Authroute.post('/register', RegisterValidate, Register);

module.exports = Authroute;