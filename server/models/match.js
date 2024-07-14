const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const Match = new Schema({
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    nextMatchId: { type: Schema.Types.ObjectId, ref: "Match", default: null },
    previousMatchId: [{ type: Schema.Types.ObjectId, ref: "Match" }],
    tournamentRoundText: { type: String, required: true },
    state: { type: String, required: true }, // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
    participants: [{ type: Object }],
    date: { type: Date, default: null },
    qualifyingMatch: { type: Boolean }
});

Match.virtual("startTime").get(function() {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

Match.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Match", Match);