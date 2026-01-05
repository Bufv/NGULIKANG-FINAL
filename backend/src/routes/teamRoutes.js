const express = require('express');
const { listTeams } = require('../controllers/teamController');

const router = express.Router();

router.get('/teams', listTeams);

module.exports = router;
