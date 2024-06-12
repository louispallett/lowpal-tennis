const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema({
        name: { type: String, required: true },
        // We may want to add matches here? Or not?
    }
)

// Category.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Category", Category);