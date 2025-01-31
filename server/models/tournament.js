const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");


const Tournament = new Schema({
    name: { type: String, required: true },
    categories: [{ type: String, required: true}],
    active: { type: Boolean, required: true, default: false },
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // Start date set at tournament set up. We'll want to organise some sort of auto deletion
    // after a year or so...
    startDate: { type: Date, required: true }
});

Tournament.virtual("startTime").get(function() {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

Tournament.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Tournament", Tournament);