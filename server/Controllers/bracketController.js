const asyncHandler = require("express-async-handler");
const Category = require("../models/category");

exports.get_bracket_categories = asyncHandler(async (req, res, next) => {
    try {
        const categories = await Category.find().select("name");
        res.json({ categories });
    } catch (err) {
        console.log(err);
    }
    
});


exports.get_bracket = asyncHandler((req, res, next) => {

});

exports.get_match_detail = asyncHandler((req, res, next) => {

});