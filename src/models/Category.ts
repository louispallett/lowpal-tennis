import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Category = new Schema({
    tournament: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    name: { 
        type: String, 
        required: true,
        enum: ["Men's Singles", "Women's Singles", "Men's Doubles", "Women's Doubles", "Mixed Doubles"]
    },
    locked: { type: Boolean, required: true, default: false },
    doubles: { type: Boolean, required: true }
});

export default mongoose.models.Category || mongoose.model("Category", Category);