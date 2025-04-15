const asyncHandler = require("express-async-handler");

const Match = require("../models/match");
const Category = require("../models/category");
const Player = require("../models/player");
const Team = require("../models/team");
const generateMatchesForTournament = require("../public/scripts/createTournament");

exports.getMatches = asyncHandler(async (req, res, next) => {

});

exports.getMatch = asyncHandler(async (req, res, next) => {

});

exports.createMatches = asyncHandler(async (req, res, next) => {
    try {
        const matchesExist = await Match.find({ category: req.body.categoryId });

        if (matchesExist.length > 0) {
            console.log(matchesExist);
            const error = new Error("Matches for this category already exist");
            error.statusCode = 401;
            throw error;
        }

        const category = await Category.findById(req.body.categoryId);

        let participants;
        if (category.doubles) {
            participants = await Team.find({ category: req.body.category });
        } else {
            participants = await Player.find({ categories: req.body.category });
        }

        const matches = generateMatchesForTournament(participants); 
        // Is an object array - should look like:
        // [
        //      {
        //          nextMatchId: "a Mongo _id",
        //          participants: [] || ["_id"] || ["_id", "_id"],
        //          tournamentRoundText: integer // note, this is determined by our algorithm and is the round number (i.e. first round is 1, etc.)
        //          previousMatchId: "a Mongo _id", // optional
        //          qualifyingMatch: boolean // optional
        //      },
        // ]
        // So, now we need to loop through each one and add the remaining static values.

        // First, we want to check that the number of matches is as expected. This should be the number of
        // participants (teams OR players) minus 1.
        // This 'equation' is tied to tree theory in CS, because each match eliminates exactly ONE team. Because 
        // there is a single winner, we must eliminate n-1 teams.
        if (matches.length !== participants.length - 1) {
            const error = new Error("Number of matches does not equal number of participants minus 1");
            error.statusCode = 500;
            throw error;
        }

        for (let match of matches) {
            match.tournament = req.body.tournamentId;
            match.category = req.body.categoryId;
            match.state = "SCHEDULED";
            match.date = new Date();
            for (let participant of match.participants) {
                participant.participantModel = category.doubles ? "Team" : "Player";
            }

            await match.save();
        }

        const totalRounds = Math.ceil(Math.log2(participants.length)); // This is the round number of the FINAL match

    } catch (err) {
        console.log(err);
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server Error",
        });
    }
});