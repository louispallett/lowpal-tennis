const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    male: { type: Boolean, required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
    seeded: { type: Boolean, required: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    ranking: { type: Number, required: true },
    host: { type: Boolean },
});

// Returns initial followed by surname - i.e. "J. Doe"
User.virtual("nameFormatted").get(function() {
    return(`${this.firstName[0]} ${this.lastName}`);
});

User.set('toJSON', { virtuals: true });

module.exports = mongoose.model("User", User);