const asyncHandler = require("express-async-handler");
const player = require("../models/player");

exports.getPlayers = asyncHandler(async (req, res, next) => {
    try {
        const players = await player.find({ categories: req.headers.categoryid })
            .populate({
                path: "user",
                select: "firstName lastName"
            });
        res.json({ players });
    } catch (err) {
        console.log(err);
    }
});