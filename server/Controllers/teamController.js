const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Team = require("../models/team");
const Player = require("../models/player");
const Category = require("../models/category");

const { createMixedTeams, createTeams } = require("../public/scripts/createTeam");
const player = require("../models/player");

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
        const players = await Player.find({ categories: req.body.categoryId })
            .select("male seeded ranking user")
            .populate({ path: "user", select: "firstName lastName" });
        const category = await Category.findById(req.body.categoryId);


        let teams;

        if (category.code === "mixDoubles") {
            const maleSeeded = players
                .filter(item => item.male && item.seeded)
                .map(item => item._id);
            const maleNonSeeded = players
                .filter(item => item.male && !item.seeded)
                .map(item => item._id);
            const femaleSeeded = players
                .filter(item => !item.male && item.seeded)
                .map(item => item._id);
            const femaleNonSeeded = players
                .filter(item => !item.male && !item.seeded)
                .map(item => item._id);
            
            teams = createMixedTeams(maleSeeded, maleNonSeeded, femaleSeeded, femaleNonSeeded);

        } else {
            const seeded = players
                .filter(item => item.seeded)
                .map(item => item._id);
            const nonSeeded = players
                .filter(item => !item.seeded)
                .map(item => item._id);

            teams = createTeams(seeded, nonSeeded);
        }

        
        for (let team of teams) {
            const player1 = players.find(item => item._id === team[0]);
            const player2 = players.find(item => item._id === team[1]);
            const newTeam = new Team({
                category: req.body.categoryId,
                players: team,
                ranking: player1.ranking + player2.ranking
            });
            await newTeam.save();
        }
        
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message });
    }
});