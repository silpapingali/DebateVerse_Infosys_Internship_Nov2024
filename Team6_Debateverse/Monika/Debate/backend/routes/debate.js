const express = require('express');
const DebateRouter = express.Router();
const {
    createDebate,
    searchDebate,
    getDebateDetails,
    allDebates,
    reactions,
    recentDebates,
    upvote,
} = require('../controllers/debateController'); // Ensure correct import


DebateRouter.post('/createDebate', createDebate);
DebateRouter.get('/alldebates', allDebates);
DebateRouter.get('/reactions', reactions);
DebateRouter.get('/getDebateDetails', getDebateDetails);
DebateRouter.get('/searchDebate', searchDebate);
DebateRouter.get('/debate/:debateId/option/:optionId/vote', upvote); // Ensure this function exists
DebateRouter.get('/recentDebates', recentDebates);

module.exports = DebateRouter;
