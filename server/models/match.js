const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Match = new Schema({
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    players: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    winner: { type: Schema.Types.ObjectId, ref: "User" },
    // Scores can possibly be formatted at backend?
    p1Score: { type: String }, 
    p2Score: { type: String }, 
});

Match.virtual("url").get(function() {
    return `/catalog/item/${this._id}`;
});

Match.pre('validate', function(next) {
    if (this.todoList.length > 2) throw("todoList exceeds maximum array size (10)!");
    next();
});

Match.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Match", Match);