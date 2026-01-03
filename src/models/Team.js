const mongoose = require("mongoose");

const clusterSchema = new mongoose.Schema({
    id: { type: Number, required: true},
    teamName: { type: String, minlength: 1, maxlength: 50 },
    leagueId: { type: Number},
    logoUrl: {type: String},
    country: {type: String},
    stadium: {type: String}
});

module.exports = mongoose.model("Team", clusterSchema);