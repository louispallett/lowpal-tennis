const asyncHandler = require("express-async-handler");

const Match = require("../models/match");
const Category = require("../models/category");
const Player = require("../models/player");
const Team = require("../models/team");
const generateMatchesForTournament = require("../public/scripts/createTournament");

const verifyUser = require("../config/verifyUser");

exports.getMatches = asyncHandler(async (req, res, next) => {
    try {
        const matches = await Match.find({ tournament: req.headers.tournamentid })
            .populate({
                path: "category",
                select: "name"
            });

        res.json({ matches });
    } catch(err) {
        console.log(err);
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server Error",
        });
    }
});

exports.getUserMatches = asyncHandler(async (req, res, next) => {
    try {
        const user = await verifyUser(req.headers.authorization);
        const player = await Player.findOne({ user: user.user._id, tournament: req.headers.tournamentid })
        const playerId = player._id;
        const userTeams = await Team.find({ players: playerId });
        const userTeamsIds = userTeams.map(item => item._id);
        const idsToCheck = [playerId, ...userTeamsIds];
        const userMatchData = await Match.find({ state: 'SCHEDULED', 'participants.id': { $in: idsToCheck }}).populate({ path: "category", select: "name"}).exec();

        res.json({ userMatchData });
    } catch (err) {
        console.log(err);
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server Error",
        });
    }
});

exports.getMatch = asyncHandler(async (req, res, next) => {

});

exports.generateMatches = asyncHandler(async (req, res, next) => {
    try {
        const matchesExist = await Match.find({ category: req.body.categoryId });

        if (matchesExist.length > 0) {
            console.log(matchesExist);
            const error = new Error("Matches for this category already exist");
            error.statusCode = 401;
            throw error;
        }

        const category = await Category.findById(req.body.categoryId);

        let participants = [];
        if (category.doubles) {
            participants = await Team.find({ category: req.body.categoryId })
                .populate({ 
                    path: "players",
                    select: "user",
                    populate: [
                        {
                            path: "user",
                            select: "firstName lastName"
                        }
                    ]
                })
                .sort("ranking");
        } else {
            participants = await Player.find({ categories: req.body.categoryId })
                .populate({
                    path: "user",
                    select: "firstName lastName"
                })
                .sort("ranking");
        }

        const generatedMatches = generateMatchesForTournament(participants); 

        const matches = generatedMatches.flat();
        
        if (matches.length !== participants.length - 1) {
            const error = new Error("Number of matches does not equal number of participants minus 1");
            error.statusCode = 500;
            throw error;
        }

        const totalRounds = Math.ceil(Math.log2(participants.length)); // This is the round number of the FINAL match

        for (let match of matches) {
            for (let participant of match.participants) {
                if (category.doubles) {
                    const team = participants.find(p => p._id === participant.id);
                    participant._id = participant.id;
                    participant.name = `${team.players[0].user.firstName} ${team.players[0].user.lastName} and ${team.players[1].user.firstName} ${team.players[1].user.lastName}`;
                    participant.participantModel = "Team";
                } else {
                    const player = participants.find(p => p._id === participant.id);
                    participant._id = participant.id;
                    participant.name = player.user.firstName + " " + player.user.lastName;
                    participant.participantModel = "Player";
                }
            }

        }
        
        res.json({ matches, totalRounds });

    } catch (err) {
        console.log(err);
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server Error",
        });
    }
});

exports.createMatches = asyncHandler(async (req, res, next) => {        
    try {
        const matchesExist = await Match.find({ category: req.body.categoryId });
        if (matchesExist.length > 0) {
            const error = new Error("Matches for this category already exist.");
            error.statusCode = 401;
            throw error;
        }

        for (let match of req.body.matches) {
            match.tournament = req.body.tournamentId;
            match.category = req.body.categoryId;

            match.date = req.body.data[match.tournamentRoundText.toString()];

            switch (match.tournamentRoundText) {
                case req.body.totalRounds:
                    match.tournamentRoundText = "Final"
                    break;
                case req.body.totalRounds - 1:
                    match.tournamentRoundText = "Semi-Finals"
                    break;
                case req.body.totalRounds - 2:
                    match.tournamentRoundText = "Quarter-Finals"
                default:
                    break;
            }

            const newMatch = new Match(match);
            await newMatch.save();
        }

        await Category.updateOne(
            { _id: req.body.categoryId},
            { $set: { locked: true } }
        );

        res.sendStatus(200);

    } catch (err) {
        console.log(err);
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server Error",
        });
    }
});