const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Match = require("../models/match");

exports.get_bracket_categories = asyncHandler(async (req, res, next) => {
    try {
        const categories = await Category.find().select("name");
        res.json({ categories });
    } catch (err) {
        console.log(err);
    }
});

exports.get_bracket = asyncHandler(async (req, res, next) => {
    try {
        const matches = await Match.find({ category: req.params.categoryId, qualifyingMatch: false });
        res.json({ matches });
    } catch(err) {
        console.log(err);
    }
});

exports.get_match_detail = asyncHandler((req, res, next) => {

});