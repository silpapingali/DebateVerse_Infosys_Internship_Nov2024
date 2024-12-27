const express = require('express');
const Router = express.Router();
const { AllDebates, Stats, fetchUserStatus, activateUser, blockUser } = require('../controllers/Admin');

Router.get('/alldebates', AllDebates);
Router.get('/stats', Stats);
Router.post('/fetchuserstatus', fetchUserStatus);
Router.post('/blockuser', blockUser);
Router.post('/activateuser', activateUser);


module.exports = Router;