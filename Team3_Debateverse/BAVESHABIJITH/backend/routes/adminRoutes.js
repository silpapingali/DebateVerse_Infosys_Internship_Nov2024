const express = require('express');
const Router = express.Router();
const {  Stats, fetchUserStatus, activateUser, blockUser, fetchAllUsers, closedDebate, removeOption } = require('../controllers/Admin');

Router.get('/stats', Stats);
Router.post('/fetchuserstatus', fetchUserStatus);
Router.post('/blockuser', blockUser);
Router.post('/activateuser', activateUser);
Router.get('/fetchallusers', fetchAllUsers);
Router.post('/closedebate', closedDebate);
Router.post('/removeoption', removeOption);

module.exports = Router;