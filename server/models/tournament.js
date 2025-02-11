const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");


const Tournament = new Schema({
    name: { type: String, required: true },
    stage: { type: String, required: true }, // "Sign-up" "Play" "Finished"
    host: { type: Schema.Types.ObjectId, ref: "User" },
    tournamentCode: { type: String, required: true },
    // Start date set at tournament set up. We'll want to organise some sort of auto deletion
    // after a year or so...
    startDate: { type: Date, required: true },
});

Tournament.virtual("startDateFormatted").get(function() {
    return DateTime.fromJSDate(this.startDate).toLocaleString(DateTime.DATE_MED);
});

Tournament.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Tournament", Tournament);