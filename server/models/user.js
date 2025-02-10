const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    tournaments: [{ type: Schema.Types.ObjectId, ref: "Tournament", required: true }],
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    male: { type: Boolean, required: true },
    // categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    seeded: { type: Boolean, required: true },
    password: { type: String, required: true },
    mobCode: { type: String, required: true },
    mobile: { type: String, required: true },
    ranking: { type: Number, required: true },
    // Not sure if we need this since we may allow accounts to run and join multiple tournaments, so 
    // the host is listed on the tournament schema and we'll just have to check whether the 
    // tournament.host === user._id?
    // host: { type: Boolean },
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