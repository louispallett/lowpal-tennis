const asyncHandler = require("express-async-handler");

const verifyUser = require("../config/verifyUser");
const Match = require("../models/match");

exports.get_match = asyncHandler(async (req, res, next) => {
    try {
        await verifyUser(req.headers.authorization);
        const match = Match.findById(req.params.matchId)
            .populate({ path: "participants.player", select: ["firstName", "lastName"]})
            .exec();
        res.status(200).json({ match });
    } catch (error) {
        res.sendStatus(403);
    }
});

exports.create_new_match = asyncHandler(async (req, res, next) => {

});

exports.post_match_results = asyncHandler((req, res, next) => {

});