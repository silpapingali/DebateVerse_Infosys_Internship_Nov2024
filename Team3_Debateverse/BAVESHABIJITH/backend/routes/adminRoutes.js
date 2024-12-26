const express = require('express');
const Router = express.Router();
const { AllDebates, Stats } = require('../controllers/AdminDebateManagement');

Router.get('/alldebates', AllDebates);
Router.get('/stats', Stats);

module.exports = Router;