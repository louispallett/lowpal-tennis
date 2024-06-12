const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        male: { type: Boolean, required: true },
        categories: { type: Array, required: true }, // We may want to reference this as a schema type
        seeded: { type: Boolean, required: true },
        password: { type: String, required: true },
        mobile: { type: String, required: true },
        host: { type: Boolean },
    }
);

User.virtual("name").get(function() {
    return(`${this.firstName} ${this.lastName}`);
});

User.set('toJSON', { virtuals: true });

module.exports = mongoose.model("User", User);