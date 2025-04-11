const asyncHandler = require("express-async-handler");
const Player = require("../models/player");

exports.getPlayers = asyncHandler(async (req, res, next) => {
    try {
        const players = await Player.find({ categories: req.headers.categoryid })
            .populate({
                path: "user",
                select: "firstName lastName"
            });
        res.json({ players });
    } catch (err) {
        console.log(err);
    }
});

exports.checkPlayerRankings = asyncHandler(async (req, res, next) => {
    try {
        const players = await Player.find({ tournament: req.headers.tournamentid })
            .sort("ranking");
        const zeroPlayers = players.filter(player => player.ranking == 0);

        res.json({ zeroPlayers });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
});

exports.getPlayerRankings = asyncHandler(async (req, res, next) => {
    try {
        const players = await Player.find({ tournament: req.headers.tournamentid })
            .select("user seeded male ranking")
            .populate({
                path: "user",
                select: "firstName lastName -_id"
            }).sort("ranking");

        res.json({ players });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

exports.updatePlayerRankings = asyncHandler(async (req, res, next) => {
    try {
        for (let player in req.body) {
            await Player.updateOne(
                { _id: player },
                { $set: { ranking: req.body[player] }}
            );
        }
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});