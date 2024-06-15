const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema({
        name: { type: String, required: true },
        players: [{ type: Schema.Types.ObjectId, ref: "User" }],
    }
)

// Category.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Category", Category);