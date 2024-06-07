const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        male: { type: Boolean, required: true },
        categories: [{ type: String, required: true }], // We may want to reference this as a schema type
        password: { type: String, required: true },
        host: { type: Boolean },
    }
);

User.virtual("name").get(function() {
    return(`${this.firstName} ${this.lastName}`);
});

module.exports = mongoose.model("User", User);