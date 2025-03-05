const asyncHandler = require("express-async-handler");

const Category = require("../models/category");
const Player = require("../models/player");
const Match = require("../models/match");
const Team = require("../models/team");

exports.getCategoryDetail = asyncHandler(async (req, res, next) => {
    const categoryId = req.headers.categoryid;
    try {
        const category = await Category.findById(categoryId)
            .populate({
                path: "tournament",
                select: "stage -_id"
            });
        const players = await Player.find({ categories: categoryId })
            .populate({
                path: "user",
                select: "firstName lastName -_id"
            });
        const matches = await Match.find({ category: categoryId });
        const teams = await Team.find({ category: categoryId })
        // console.log(players, category, matches);

        res.json({ category, players, matches, teams })
    } catch (err) {
        console.log(err);
    }
});