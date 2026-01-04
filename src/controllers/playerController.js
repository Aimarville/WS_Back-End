const Player = require('../models/Player');
const User = require("../models/User");

// GET /api/players
exports.getAllPlayers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const players = await Player.find().skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            data: players
        });
    } catch (error) {
        console.error('Errorea jokalariak lortzean:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Errorea jokalariak lortzean'
            }
        });
    }
};

// GET /api/players/:id
exports.getPlayerById = async (req, res) => {
    try {
        const player = await Player.findOne({ id: Number(req.params.id) });

        if (!player) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Jokalaria ez da aurkitu'
                }
            });
        }

        res.status(200).json({
            success: true,
            data: player,
            message: 'Jokalaria arrakastaz lortua'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_ID',
                message: 'ID baliogabea',
                details: [
                    {
                        field: 'id',
                        message: 'Emandako IDak ez du formatu zuzena'
                    }
                ]
            }
        });
    }
};


exports.createPlayer = async (req, res) => {
    try {
        const {id, name, teamId, leagueId } = req.body;

        const player = await Player.findOne({ id: id });
        if (player) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'BAD_REQUEST',
                    message: 'Jokalaria jadanik existitzen da'
                }
            });
        }

        const newPlayer = new Player({id, name, teamId, leagueId });
        console.log('Erabiltzailea erregistratzen:', {id, name, teamId, leagueId });
        await newPlayer.save();

        res.status(201).json({
            success: true,
            data: newPlayer,
            message: 'Jokalaria arrakastaz sortua'
        });

    } catch (error) {
        console.error('Errorea jokalaria sortzean:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Errorea jokalaria sortzean'
            }
        });
    }
};


exports.updatePlayer = async (req, res) => {
    try {

        const { name, teamId, leagueId } = req.body;

        const player = await Player.findOne({ id: Number(req.params.id) });
        if (!player) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Jokalaria ez da aurkitu'
                }
            });
        }

        // Actualizar campos
        if (name) player.name = name;
        if (teamId) player.teamId = teamId;
        if (leagueId) player.leagueId = leagueId;

        await player.save();

        res.status(200).json({
            success: true,
            data: player,
            message: 'Jokalaria arrakastaz eguneratua'
        });

    } catch (error) {
        console.error('Errorea jokalaria eguneratzean:', error);
        res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_ID',
                message: 'ID baliogabea edo errorea eguneratzean'
            }
        });
    }
};


exports.deletePlayer = async (req, res) => {
    try {
        const player = await Player.findOne({ id: Number(req.params.id) });
        if (!player) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Jokalaria ez da aurkitu'
                }
            });
        }

        await player.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Jokalaria arrakastaz ezabatua'
        });

    } catch (error) {
        console.error('Errorea jokalaria ezabatzean:', error);
        res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_ID',
                message: 'ID baliogabea edo errorea ezabatzean'
            }
        });
    }
};

exports.getAllTeams = async (req, res) => {
    try {
        // Obtener todos los jugadores
        const players = await Player.find().select('team -_id'); // solo el campo 'team'
        // Extraer equipos únicos
        const teams = [...new Set(players.map(p => p.team))];

        res.status(200).json({
            success: true,
            data: teams,
            message: 'Talde guztiak lortu dira'
        });
    } catch (error) {
        console.error('Errorea taldeak lortzean:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Errorea taldeak lortzean'
            }
        });
    }
};

exports.getAllLeagues = async (req, res) => {
    try {
        const players = await Player.find().select('league -_id'); // solo el campo 'league'
        const leagues = [...new Set(players.map(p => p.league))];

        res.status(200).json({
            success: true,
            data: leagues,
            message: 'Liga guztiak lortu dira'
        });
    } catch (error) {
        console.error('Errorea ligak lortzean:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Errorea ligak lortzean'
            }
        });
    }
};