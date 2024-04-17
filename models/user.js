const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    tournament: [{ type: Schema.Types.ObjectId, ref: "Tournament" }],
    seeded: [{ type: Boolean }],
});

UserSchema.virtual("url").get(function() {
    return `/users/user.${this._id}`;
});

UserSchema.virtual("name").get(function() {
    return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", UserSchema);