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

        const matches = generateMatchesForTournament(participants); 

        const matchArr = matches.flat();

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
        
        if (matchArr.length !== participants.length - 1) {
            const error = new Error("Number of matches does not equal number of participants minus 1");
            error.statusCode = 500;
            throw error;
        }

        const totalRounds = Math.ceil(Math.log2(participants.length)); // This is the round number of the FINAL match

        for (let match of matchArr) {
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
            match.tournament = req.body.tournamentId;
            match.category = req.body.categoryId;
            match.date = new Date();
            switch (match.tournamentRoundText) {
                case totalRounds:
                    match.tournamentRoundText = "Final"
                    break;
                case totalRounds - 1:
                    match.tournamentRoundText = "Semi-Finals"
                    break;
                case totalRounds - 2:
                    match.tournamentRoundText = "Quarter-Finals"
                default:
                    break;
            }

            const newMatch = new Match(match);
            await newMatch.save();
        }

        const savedMatches = await Match.find({ category: req.body.categoryId });

        // ? We may want to just pass the matchArr object here and NOT create/save the Mongo document. We could then display it to the client and ask the 
        // ? user to add the deadline dates. Then, once the user submits this, we actual save the matches to Mongo.
        // ? We can then change this function to 'generateMatches' and then create a 'createMatches' function. This would allow us to simplify this function
        // ? slightly by moving things like the 'tournmentRoundText' changes to the createMatches function (and even the categoryId and tournamentId)
        
        res.json({ savedMatches, totalRounds });

    } catch (err) {
        console.log(err);
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server Error",
        });
    }
});