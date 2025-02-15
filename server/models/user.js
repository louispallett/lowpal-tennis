const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    tournamentsPlaying: [{ type: Schema.Types.ObjectId, ref: "Tournament", required: true }],
    tournamentsHosting: [{ type: Schema.Types.ObjectId, ref: "Tournament", required: true }],
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobCode: { type: String, required: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
});

// Returns initial followed by surname - i.e. "J. Doe"
User.virtual("name-short").get(function() {
    return(`${this.firstName[0]} ${this.lastName}`);
});

// Returns names concatenated
User.virtual("name-long").get(function() {
    return(`${this.firstName} ${this.lastName}`);
});

User.set('toJSON', { virtuals: true });

module.exports = mongoose.model("User", User);