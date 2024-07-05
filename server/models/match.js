const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const participant = new Schema({
    // We use either player or team depending on singles/doubles repectively - only one should be used
    player: { type: Schema.Types.ObjectId, ref: "User" },
    team: { type: Schema.Types.ObjectId, ref: "Team" },
    resultText: { type: String, default: null },
    isWinner: { type: Boolean, default: false },
    status: { type: String, default: null }, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY'
    name: { type: String } // This will be defined as player.names_formatted OR team.names_formatted
});

const Match = new Schema({
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    nextMatchId: { type: Schema.Types.ObjectId, ref: "Match", default: null },
    tournamentRoundText: { type: String, required: true },
    state: { type: String, required: true }, // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
    // We need this to distinguish between the two types of matches. The enumeration value is so that only either 'singles' or 'doubles' can be given for this element!
    // matchType: { type: String, enum: ["singles", "doubles"], required: true },
    participants: [participant]
});

Match.virtual("date_formatted").get(function() {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED);
});

Match.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Match", Match);