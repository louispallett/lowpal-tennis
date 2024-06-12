const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const participant = new Schema({
    player: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    resultText: { type: String } || null,
    isWinner: { type: Boolean, required: true },
    status: { type: String } || null,
    name: { type: String }
});

const Match = new Schema({
    nextMatchId: { type: Schema.Types.ObjectId, ref: "Match" } || null,
    tournamentRoundText: { type: String, required: true },
    state: { type: String, required: true },
    participants: [participant]
});

Match.virtual("date_formatted").get(function() {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED);
});

Match.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Match", Match);