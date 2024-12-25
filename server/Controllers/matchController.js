const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const createTeams = require("../public/scripts/createTeam").createTeams;
const createMixedTeams = require("../public/scripts/createTeam").createMixedTeams;
const generateMatchesForTournament = require("../public/scripts/createTournament");

const Match = require("../models/match");
const Category = require("../models/category");
const User = require("../models/user");
const Team = require("../models/team");

const verifyUser = require("../config/verifyUser");
const { default: mongoose } = require("mongoose");

exports.get_matches = asyncHandler(async (req, res, next) => {
    try {
        const user = await verifyUser(req.headers.authorization);
        const userId = user.user._id;
        const userTeams = await Team.find({ players: userId }).exec();
        const userTeamsIds = userTeams.map(item => item._id.toString());
        const idsToCheck = [userId.toString(), ...userTeamsIds];
        const userMatchData = await Match.find({ state: 'SCHEDULED', 'participants.id': { $in: idsToCheck }}).populate({ path: "category", select: "name"}).exec();
        res.json({ userMatchData });
    } catch (err) {
        console.log(err);
        res.status(403).json({ msg: `Get matches error: ${err}` });
    }
});

exports.get_match = asyncHandler(async (req, res, next) => {
    try {
        const match = await Match.findById(req.params.matchId).populate({ path: "category", select: "name"}).exec();
        res.json({ match });
    } catch (err) {
        res.sendStatus(403);
    }
});

exports.get_contact_details = asyncHandler(async (req, res, next) => {
    try {
        const match = await Match.findById(req.params.matchId);
        let isUser = await User.findById(match.participants[0].id);
        const data = [];
        if (isUser) {
            data.push({ 
                name: `${isUser.firstName[0]}. ${isUser.lastName}`, 
                mobCode: isUser.mobCode, 
                mobile: isUser.mobile 
            });
            let user2;
            if (match.participants.length > 1) {
                user2 = await User.findById(match.participants[1].id);
                data.push({ name: `${user2.firstName[0]}. ${user2.lastName}`, 
                    mobCode: user2.mobCode, 
                    mobile: user2.mobile 
                });
            }
        } else {
            const team1 = await Team.findById(match.participants[0].id).populate({ path: "players", select: "mobile firstName lastName" });
            data.push({ name: `${team1.players[0].firstName[0]}. ${team1.players[0].lastName}`, 
                mobCode: team1.players[0].mobCode,
                mobile: team1.players[0].mobile 
            });
            data.push({ name: `${team1.players[1].firstName[0]}. ${team1.players[1].lastName}`, 
                mobCode: team1.players[1].mobCode,
                mobile: team1.players[1].mobile 
            });
            let team2;
            if (match.participants.length > 1) {
                team2 = await Team.findById(match.participants[1].id).populate({ path: "players", select: "mobile firstName lastName" });
                data.push({ name: `${team2.players[0].firstName[0]}. ${team2.players[0].lastName}`, 
                    mobCode: team2.players[0].mobCode,
                    mobile: team2.players[0].mobile 
                });
                data.push({ name: `${team2.players[1].firstName[0]}. ${team2.players[1].lastName}`, 
                    mobCode: team2.players[1].mobCode,
                    mobile: team2.players[1].mobile 
                });
            }
        }
        res.json({ data })
    } catch (err) {
        console.log(err);
        res.status(401).json({ msg: `Get contact details error: ${err}` });
    }
});

exports.create_matches = asyncHandler(async (req, res, next) => {
    if (!req.body.category) res.status(400).json({ message: "Category missing" });

    // Check if matches for this category already exist (we don't want to re-do them!)
    const matchesAlreadyExist = await Match.find({ category: req.body.category }).exec();
    if (matchesAlreadyExist.length > 0) res.status(401).json({ error: `Matches for ${req.body.category} already exist`});

    const [isMixed, singles] = await Promise.all([
        Category.findOne({ name: "Mixed Doubles" }).exec(),
        Category.find({ name: { $in: ["Mens Singles", "Womens Singles"] }}).exec()
    ]);
    
    if (!isMixed || !singles) {
        res.status(500).json({ error: "Server error: categories not found" });
    }

    const isSinglesMatch = singles.some(single => single._id.toString() === req.body.category); 

    if (isSinglesMatch) {
        // In this instance we can just create the matches using the current Users
        try {
            const teams = await User.find({ categories: req.body.category }, { firstName: 1, lastName: 1, seeded: 1, ranking: 1 }).sort({ ranking: 1 });
            
            if (teams.length < 4) {
                throw new Error("Number of players must be at least four (4).");
            }
            
            const matches = generateMatchesForTournament(req.body.category, teams).flat();
           
            for (let i = 0; i < matches.length; i++) {
                const match = new Match(matches[i]);
                await match.save();
            }
           
            res.status(200).json({ matches });
        } catch (err) {
            console.log(err);
            res.status(401).json({ message: `Error (match (singles) creation): ${err}` });
        }    
    } else {
        // In this instance, we need to create our doubles teams.
        // Since creating mixed doubles is obviously slightly different, we need to check whether it's mixed. If it isn't, it's a non-mixed doubles (mens || womens)
        if (req.body.category == isMixed._id) {
            try {
                const category = await Category.findById(req.body.category).populate({ path: "players", select: "firstName male lastName seeded ranking" }).exec();
                
                if (!category) {
                    throw new Error("Category not found");
                }

                if (category.players.length < 8) {
                    throw new Error("Number of players must be at least 8 (creating 4 teams of doubles)");
                }
                
                const teamsAlreadyExist = await Team.find({ category: req.body.category }).exec();
                
                if (teamsAlreadyExist.length > 0) {
                    throw new Error(`Teams for ${req.body.category} already exist`);
                }
                
                const teams = createMixedTeams(category);
                
                for (let i = 0; i < teams.length; i++) {
                    const team = new Team(teams[i]);
                    await team.save();
                }

            } catch (err) {
                console.log(err);
                res.status(401).json({ message: `Error (team creation): ${err}` });
            }
        } else {
            try {
                const category = await Category.findById(req.body.category).populate({ path: "players", select: "firstName lastName seeded ranking" }).exec();
                
                if (!category) {
                    throw new Error("Category not found");
                }

                if (category.players.length < 8) {
                    throw new Error("Number of players must be at least 8 (creating 4 teams of doubles)");
                }
                
                const teamsAlreadyExist = await Team.find({ category: req.body.category }).exec();
                
                if (teamsAlreadyExist.length > 0) {
                    res.status(401).json({ error: `Teams for ${req.body.category} already exist`});
                }

                const teams = createTeams(category);

                for (let i = 0; i < teams.length; i++) {
                    const team = new Team(teams[i]);
                    await team.save();
                }
            } catch (err) {
                console.log(err);
                res.status(401).json({ message: `Error (team creation): ${err}` });
            }
        }

        // Second try catch creates our matches. Since this is the same for both mixed and non-mixed, we run this for either case here, to be less verbose
        try {
            const teams = await Team.find({ category: req.body.category }).populate({ path: "players", select: "firstName lastName seeded ranking" }).sort({ ranking: 1 }).exec();
            const matches = generateMatchesForTournament(req.body.category, teams).flat();
            for (let i = 0; i < matches.length; i++) {
                const match = new Match(matches[i]);
                await match.save();
            }
            res.json({ matches });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: `Error (match (doubles) creation): ${err}` });
        }
    }    
});

exports.post_match_results = [
    body("winner", "You must provide a winner")
        .trim()
        .escape(),
    body("team1Score", "Score must be provided")
        .trim()
        .escape(),
    body("team2Score", "Score must be provided")
        .trim()
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(401).json({ error: "Validation error", msg: errors });
            return;
        }

        try {
            const match = await Match.findById(req.params.matchId);
            if (match.updateNumber > 0) {
                console.log("Match already updated");
                res.json({ error: "This match has already been updated." });
                return;
            }
            await Match.updateOne(
            { _id: req.params.matchId, 'participants.id': req.body.winner },
            { $set: { 'participants.$.isWinner': true } }
            );
        
            await Match.updateOne(
            { _id: req.params.matchId },
            {
                $set: {
                'participants.$[participant1].resultText': req.body.team1Score,
                'participants.$[participant2].resultText': req.body.team2Score
                }
            },
            {
                arrayFilters: [
                { 'participant1.id': match.participants[0].id },
                { 'participant2.id': match.participants[1].id }
                ]
            }
            );
            await Match.updateOne(
                { _id: req.params.matchId },
                { $set: { state: "SCORE_DONE" } }
            );
            await Match.updateOne(
                { _id: req.params.matchId },
                { $inc: { updateNumber: 1 } }
            );

            let winningPlayerInfo = await User.findById(req.body.winner);
            if (!winningPlayerInfo) winningPlayerInfo = await Team.findById(req.body.winner); // MAYBE adding name to team model?

            // Finally, we need find the next match and push our winning participant to it
            if (match.nextMatchId != null) {
                await Match.updateOne(
                    { _id: match.nextMatchId },
                    { $push: 
                        { participants: { 
                            id: req.body.winner, 
                            name: winningPlayerInfo.name,
                            ranking: winningPlayerInfo.ranking,
                            resultText: null,
                            isWinner: false,
                            status: null
                        }}
                    }
                );
            }
        
            res.json({ msg: "Success" });
        } catch (err) {
            console.error('Error updating participant:', err);
            res.status(500).json({ msg: `Error (match update): ${err}` });
        }
      
    })
]