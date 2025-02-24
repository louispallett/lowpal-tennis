const asyncHandler = require("express-async-handler");

const Category = require("../models/category");
const Player = require("../models/player");
const Match = require("../models/match");

exports.getCategoryDetail = asyncHandler(async (req, res, next) => {
    try {
        const category = await Category.findById(req.headers.categoryid)
            .populate({
                path: "tournament",
                select: "stage -_id"
            });
        const players = await Player.find({ categories: req.headers.categoryid })
            .populate({
                path: "user",
                select: "firstName lastName -_id"
            });
        const matches = await Match.find({ category: req.headers.categoryid });
            console.log(players, category, matches);

        res.json({ category, players, matches })
    } catch (err) {
        console.log(err);
    }
});