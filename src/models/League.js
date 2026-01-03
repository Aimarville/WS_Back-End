const mongoose = require("mongoose");

const clusterSchema = new mongoose.Schema({
    id: { type: Number, required: true},
    leagueName: { type: String, minlength: 1, maxlength: 100 },
    code: {type: String},
    country: {type: String},
    flagUrl: {type: String}
});

module.exports = mongoose.model("League", clusterSchema);