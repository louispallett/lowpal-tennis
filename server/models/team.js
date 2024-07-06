const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* Note that team is only used for doubles matches */

const Team = new Schema({
    players: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    ranking: { type: Number, required: true }
}, { id: false });

// FIXME: This is broken as it needs the players element to be populated - easier to just do it on the controller and return it as part of the information.
// Returns initial followed by surname for both players - i.e. "J. Doe and S. Samuelson"
// Team.virtual("name_formatted").get(function() {
//     return `${this.players[0].firstName[0]}. ${this.players[0].lastName} and ${this.players[1].firstName[0]}. ${this.players[1].lastName}`;
// });

Team.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Team", Team);