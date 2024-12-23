const express = require('express');
const AdminRouter = express.Router();
const {
    allDebates,moderatedebate
    
} = require('../controllers/adminController');


DebateRouter.get('/alldebates', allDebates);
DebateRouter.get('/moderate/:id',moderatedebate);
