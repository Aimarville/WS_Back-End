const express = require('express');
const router = express.Router();

const playerController = require('../controllers/playerController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const { validatePlayerUpdate } = require('../middleware/validatorMiddleware');

// Endpoints públicos para el juego
router.get('/players', playerController.getAllPlayers);
router.get('/players/:id', playerController.getPlayerById);
router.post('/players',isAuthenticated, isAdmin,validatePlayerUpdate, playerController.createPlayer);
router.put('/players/:id',isAuthenticated, isAdmin,validatePlayerUpdate, playerController.updatePlayer);
router.delete('/players/:id',isAuthenticated, isAdmin, playerController.deletePlayer);
router.get('/teams', playerController.getAllTeams);
router.get('/leagues', playerController.getAllLeagues);

module.exports = router;