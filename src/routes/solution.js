const express = require('express');
const router = express.Router();

const solutionController = require('../controllers/solutionController');

router.get('/solution/:gameNumber', solutionController.getSolutionByGameNumber);

module.exports = router;