
const express = require('express');
const Authroute = express.Router();
const { Validate } = require('../middlewares/AuthValidation');

const {Login, Register} = require('../controllers/Auth')

Authroute.post('/login',Login)
Authroute.post('/register', Register);

module.exports = Authroute;