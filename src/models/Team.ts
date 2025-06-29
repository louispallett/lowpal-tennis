import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Team = new Schema({
    tournament: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    players: [{ type: Schema.Types.ObjectId, ref: "Player", required: true }],
    ranking: { type: Number, required: true }
});

Team.set('toJSON', { virtuals: true });

export default mongoose.models.Team || mongoose.model("Team", Team);