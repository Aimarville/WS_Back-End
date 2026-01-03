const mongoose = require("mongoose");

const clusterSchema = new mongoose.Schema({
    id: { type: Number, required: true},
    name: { type: String, minlength: 1, maxlength: 50 },
    birthdate: { type: Date},
    nationality: { type: String},
    teamId: { type: Number, required: true},
    leagueId: { type: Number, required: true},
    position: { type: String, enum: ["GK", "DF", "MF", "FW"]},
    number: { type: Number, min: 1, max: 99},
    imageUrl: { type: String}
});

module.exports = mongoose.model("Player", clusterSchema);