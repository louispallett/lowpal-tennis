const asyncHandler = require("express-async-handler");

const createTeams = require("../public/scripts/createTeam");
const Match = require("../models/match");
const verifyUser = require("../config/verifyUser");

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

exports.create_teams = asyncHandler(async (req, res, next) => {
    const categoryId = req.body.category;
    if (!categoryId) {
        res.sendStatus(400);
    }
    try {
        const newTeams = await createTeams(categoryId);
        res.status(200).json({ newTeams });
    } catch (err) {
        console.log(err);
    }
})

exports.create_new_match = asyncHandler(async (req, res, next) => {

});

exports.post_match_results = asyncHandler((req, res, next) => {

});