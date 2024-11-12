
const express = require('express');
const Authroute = express.Router();

const Login = require('../controllers/Auth')

Authroute.post('/login',Login)

module.exports = Authroute;