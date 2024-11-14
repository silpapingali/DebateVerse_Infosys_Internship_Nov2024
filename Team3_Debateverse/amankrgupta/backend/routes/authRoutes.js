
const express = require('express');
const Authroute = express.Router();
const { Validate } = require('../middlewares/AuthValidation');

const {Login, Register} = require('../controllers/Auth');
const { validate } = require('../models/userModels');

Authroute.post('/login',Login)
Authroute.post('/register',Validate, Register);

module.exports = Authroute;