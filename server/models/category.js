const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema({
    tournament: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
});

module.exports = mongoose.model("Category", Category);