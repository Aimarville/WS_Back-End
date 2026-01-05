require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("../config/index.js");
const Player = require("../models/Player");
const Team = require("../models/Team");
const League = require("../models/League");

const playersData = require(path.join(__dirname, '../../public/json/fullplayers25.json'));
const teamsDataRaw = require(path.join(__dirname, '../../public/json/teams25.json'));
const leaguesData = require(path.join(__dirname, '../../public/json/leagues25.json'))

const generatePlayers = players =>
    players.map(player => ({
        id: player.id,
        name: player.name,
        birthDate: new Date(player.birthdate),
        nationality: player.nationality,
        teamId: player.teamId,
        leagueId: player.leagueId,
        position: player.position,
        number: player.number,
        imageUrl: `/images/players/${player.id}.png`,
    }));

const generateTeams = teamsObject => {
    return Object.entries(teamsObject).map(([id, team]) => ({
        id: Number(id),
        teamName: team.teamName,
        stadium: team.stadium,
        country: team.country,
        imageUrl: `/images/teams/${id}.png`
    }));
};

const generateLeagues = leagues =>
    leagues.map(league => ({
        id: league.id,
        leagueName: league.leagueName,
        code: league.code,
        country: league.country,
        flagUrl: `/images/flags/${league.country}.svg`,
    }));

async function seed(){
    try{
        await mongoose.connect(connectDB.database.uri);

        await Player.deleteMany();
        await Team.deleteMany();
        await League.deleteMany();

        await Player.insertMany(generatePlayers(playersData));
        await Team.insertMany(generateTeams(teamsDataRaw));
        await League.insertMany(generateLeagues(leaguesData));
        console.log("Seeding successfully finished.");
        process.exit(0);
    }catch (error){
        console.error(error);
        process.exit(1);
    }
}

seed();