const express = require('express');
const DebateRouter = express.Router();
const {
    createDebate,
    searchDebate,
    getDebateDetails,
    allDebates,
    reactions,
    upvote
} = require('../controllers/debateController');

// Route to create a debate
DebateRouter.post('/createDebate', createDebate);
DebateRouter.get('/alldebates', allDebates);
DebateRouter.get('/reactions', reactions);
/*DebateRouter.post('/upvote', upvote);*/
DebateRouter.post('/getDebateDetails', getDebateDetails);
DebateRouter.get('/debates/search', searchDebate);
DebateRouter.post('/debate/:debateId/option/:optionId/vote', upvote); // Voting on options


module.exports = DebateRouter;
