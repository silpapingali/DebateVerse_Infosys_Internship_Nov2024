// backend/routes/debateRoute.js

const express = require('express');
const { CreateDebate, AllDebates, MyDebates, LikeDebate, searchDebates } = require('../controllers/Debates'); // Import searchDebates
const { Authjwt } = require('../middlewares/Authjwt');

const DebateRoutes = express.Router();

DebateRoutes.get('/alldebates', Authjwt, AllDebates);
DebateRoutes.post('/create', Authjwt, CreateDebate);
DebateRoutes.get('/mydebates', Authjwt, MyDebates);
DebateRoutes.get('/likerequest', Authjwt, LikeDebate);

// Search route
DebateRoutes.post('/search', Authjwt, searchDebates); // Correct POST route for search

module.exports = DebateRoutes;
