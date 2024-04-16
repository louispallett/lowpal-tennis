const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TournamentSchema = new Schema({
    title: { type: String, required: true },
});

TournamentSchema.virtual("url").get(function() {
    return `/tournament.${this._id}`;
});

module.exports = mongoose.model("Tournament", TournamentSchema);