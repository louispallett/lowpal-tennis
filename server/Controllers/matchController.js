const asyncHandler = require("express-async-handler");

const createTeams = require("../public/scripts/createTeam").createTeams;
const createMixedTeams = require("../public/scripts/createTeam").createMixedTeams;
const generateMatchesForTournament = require("../public/scripts/createTournament");

const Match = require("../models/match");
const Category = require("../models/category");
const User = require("../models/user");
const Team = require("../models/team");

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

    // Check if matches for this category already exist (we don't want to re-do them!)
    const matchesAlreadyExist = await Match.find({ category: req.body.category }).exec();
    if (matchesAlreadyExist.length > 0) res.status(401).json({ error: `Matches for ${req.body.category} already exist`});

    const [isMixed, singles] = await Promise.all([
        Category.findOne({ name: "Mixed Doubles" }).exec(),
        Category.find({ name: { $in: ["Mens Singles", "Womens Singles"] }}).exec()
    ]);
    if (!isMixed || !singles) res.status(500).json({ error: "Server error: categories not found" })

    const isSinglesMatch = singles.some(single => single._id.toString() === req.body.category); 

    if (isSinglesMatch) {
        // In this instance we can just create the matches using the current Users
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
            res.status(401).json({ message: `Error (match (singles) creation): ${err}` });
        }    
    } else {
        // In this instance, we need to create our doubles teams.
        // Since creating mixed doubles is obviously slightly different, we need to check whether it's mixed. If it isn't, it's a non-mixed doubles (mens || womens)
        if (req.body.category == isMixed._id) {
            try {
                const category = await Category.findById(req.body.category).populate({ path: "players", select: "firstName male lastName seeded ranking" }).exec();
                if (!category) throw new Error("Category not found");
                
                const teamsAlreadyExit = await Team.find({ category: req.body.category }).exec();
                if (teamsAlreadyExit.length > 0) res.status(401).json({ error: `Teams for ${req.body.category} already exist`});
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
                if (!category) throw new Error("Category not found");
                
                const teamsAlreadyExit = await Team.find({ category: req.body.category }).exec();
                if (teamsAlreadyExit.length > 0) res.status(401).json({ error: `Teams for ${req.body.category} already exist`});
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
            res.status(401).json({ message: `Error (match (doubles) creation): ${err}` });
        }
    }    
});

exports.post_match_results = asyncHandler((req, res, next) => {

});