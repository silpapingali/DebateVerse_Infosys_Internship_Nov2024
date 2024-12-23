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


DebateRouter.post('/createDebate', createDebate);
DebateRouter.get('/alldebates', allDebates);
DebateRouter.get('/reactions', reactions);
DebateRouter.post('/getDebateDetails', getDebateDetails);
DebateRouter.get('api/debate/searchDebate', searchDebate);
DebateRouter.post('/debate/:debateId/option/:optionId/vote', upvote); 


module.exports = DebateRouter;
