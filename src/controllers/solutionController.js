const Player = require('../models/Player');


exports.getSolutionByGameNumber = async (req, res) => {
    try {
        const gameNumber = parseInt(req.params.gameNumber);
        if (isNaN(gameNumber) || gameNumber < 1) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_GAME_NUMBER',
                    message: 'Game number must be a positive integer'
                }
            });
        }

        const players = await Player.find(); // todos los jugadores
        if (players.length === 0) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NO_PLAYERS',
                    message: 'No hay jugadores en la base de datos'
                }
            });
        }

        const index = (gameNumber - 1) % players.length; // -1 para que 1 => índice 0
        const playerOfTheDay = players[index];

        res.status(200).json({
            success: true,
            data: playerOfTheDay,
            message: `Eguneko jokalaria (gameNumber ${gameNumber})`
        });

    } catch (error) {
        console.error('Errorea solution lortzean:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Errorea jokalaria lortzean'
            }
        });
    }
};