const asyncHandler = require("express-async-handler");

const createTeams = require("../public/scripts/createTeam");
const generateMatchesForTournament = require("../public/scripts/createTournament");
const Match = require("../models/match");
const Category = require("../models/category");
const User = require("../models/user");
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

exports.create_matches = asyncHandler(async (req, res, next) => {
    if (!req.body.category) res.status(400).json({ message: "Category missing" });
    // if (!req.body.matchType) res.status(400).json({ message: "Match Type missing" });
    
    // const category = await Category.findById(req.body.category).exec();
    // const teams = category.players;
    try {
        const teams = await User.find({ categories: req.body.category }, { firstName: 1, lastName: 1, seeded: 1, ranking: 1 }).sort({ ranking: 1 });
        const matches = generateMatchesForTournament(req.body.category, teams).flat();
        for (let i = 0; i < matches.length; i++) {
            const match = new Match(matches[i]);
            await match.save();
        }
        res.status(200).json({ matches });
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: `Error: ${err}` })
    }    
});

exports.post_match_results = asyncHandler((req, res, next) => {

});