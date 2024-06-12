const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Team = new Schema({
    players: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true }
});

Match.virtual("players_formatted").get(function() {
    if (this.players.length < 2) {
        return `${this.players[0].firstName} ${this.players[0].lastName} and ${this.players[1].firstName} ${this.players[1].lastName}`;
    } else {
        return `${this.players[0].firstName} ${this.players[0].lastName}`;
    }
});

Match.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Team", Team);