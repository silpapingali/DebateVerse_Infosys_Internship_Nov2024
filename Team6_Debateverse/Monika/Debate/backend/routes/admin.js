const express = require('express');
const AdminRouter = express.Router();
const {
    allDebates,recentDebates,searchDebate,UserDetail,searchUser,suspendUser,deleteUser
    
} = require('../controllers/adminController');


AdminRouter.get('/alldebates', allDebates);
AdminRouter.get('/recentDebates', recentDebates);
AdminRouter.get('/searchDebate', searchDebate);
AdminRouter.get('/UserDetail', UserDetail);
AdminRouter.get('/searchUser', searchUser);
AdminRouter.get('/deleteUser', deleteUser);
AdminRouter.get('/suspendUser', suspendUser);



module.exports = AdminRouter;