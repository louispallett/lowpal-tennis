const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* Note that team is only used for doubles matches */

const Team = new Schema({
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    players: [{ type: Schema.Types.ObjectId, ref: "Player", required: true }],
    ranking: { type: Number, required: true }
}, { id: false });

Team.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Team", Team);