const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const Match = new Schema({
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    nextMatchId: { type: Schema.Types.ObjectId, ref: "Match", default: null },
    previousMatchId: { type: Schema.Types.ObjectId, ref: "Match" },
    tournamentRoundText: { type: String, required: true },
    state: { type: String, required: true }, // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
    // We need this to distinguish between the two types of matches. The enumeration value is so that only either 'singles' or 'doubles' can be given for this element!
    // matchType: { type: String, enum: ["singles", "doubles"], required: true },
    participants: [{ type: Object }],
    startTime: { type: Date, default: null }
});

Match.virtual("date_formatted").get(function() {
    return DateTime.fromJSDate(this.startTime).toLocaleString(DateTime.DATETIME_MED);
});

Match.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Match", Match);