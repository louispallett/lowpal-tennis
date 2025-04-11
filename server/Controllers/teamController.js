const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Team = require("../models/team");
const Player = require("../models/player");

exports.getTeams = asyncHandler(async (req, res, next) => {
    try {
        const teams = await Team.find({ category: req.headers.categoryid });
        res.status(200).json({ teams });
    } catch (err) {
        console.log(err);
    }
});

exports.createTeams = asyncHandler(async (req, res, next) => {
    try {
        const players = await Player.find({ categories: req.body.categoryId });
        console.log(players.length);
        
        const teams = [];

        res.status(200).json({ teams });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message });
    }
});