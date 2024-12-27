const express = require('express');
const debateController = require('../controllers/debate-controller');
const authenticate = require('../middleware/authenticate'); // Assuming this is a middleware to authenticate users
const router = express.Router();

// Create Debate
router.post('/', authenticate, debateController.createDebate);

// Get Debates for User
router.get('/', authenticate, debateController.getDebates);

module.exports = router;
