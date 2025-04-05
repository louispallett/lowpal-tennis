const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const generator = require("generate-password");

const verifyUser = require("../config/verifyUser");

const Tournament = require("../models/tournament");
const Category = require("../models/category");
const Match = require("../models/match");
const Player = require("../models/player");
const Team = require("../models/team");

exports.createTournament = [
    body("tournamentName")
    .trim()
    .escape()
    .isLength({ min: 1, max: 50 }).withMessage("Tournament name cannot be more than 50 characters"),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array())
            res.status(400).json({ message: "Validation Failed", errors: errors.array() })
            return;
        }

        try {
            // We need to create the categories here:
            const fullCategories = [
                { code: "mSingles", name: "Men's Singles"},
                { code: "mDoubles", name: "Men's Doubles"},
                { code: "wSingles", name: "Women's Singles"},
                { code: "wDoubles", name: "Women's Doubles"},
                { code: "mixDoubles", name: "Mixed Doubles"},
            ];

            // Create an empty array - this is where we'll store the category IDs.
            const categoryList = [];
            // Filter out the unused categories
            const categories = fullCategories.filter(cat => req.body.categories.includes(cat.code));
            
            // Create our tournament code:
            let tournamentCode = generator.generate({
                length: 10,
                numbers: true,
                symbols: false,
                exclude: "'\"`;_@,.-{}[]~#\\|¬",
                strict: true
            });

            tournamentCode = req.body.tournamentName.split(" ")[0] + tournamentCode;
            
            // Ensure that tournament code doesn't already exist
            while (true) {
                const codeExists = await Tournament.findOne({ tournamentCode: tournamentCode });
                if (!codeExists) break;
                tournamentCode = generator.generate({
                    length: 15,
                    numbers: true,
                    symbols: false,
                    exclude: "'\"`;_@,.-{}[]~#\\|¬",
                    strict: true
                });
                tournamentCode = req.body.tournamentName.replace(/\s/g,'') + tournamentCode;
            }

            const tournament = new Tournament({
                name: req.body.tournamentName,
                stage: "sign-up",
                host: req.body.userId,
                tournamentCode: tournamentCode,
                startDate: new Date(),
                showMobile: req.body.showMobile,
                seededPlayers: req.body.seededPlayers,
            });
            const newTournament = await tournament.save();

            // Loop through the filtered categories and create category instances
            for (let category of categories) {
                const newCategory = new Category({
                    name: category.name,
                    code: category.code,
                    tournament: newTournament._id,
                    doubles: category.code === "mDoubles" || category.code === "wDoubles" || category.code === "mixDoubles",
                });
                await newCategory.save();
            }

            res.status(200).json({ tournamentId: newTournament._id });
        } catch (err) {
            console.log("Catch TC00CT: " + err);
            res.status(500).json({ error: "Catch TC00CT: " + err});
        }
    })
];

exports.joinTournament = [
    body("tournamentId")
        .trim()
        .escape()
        .isLength({ min: 1 }).withMessage("ERROR: Tournament ID not found"),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array())
            res.status(400).json({ message: "Validation Failed", errors: errors.array() })
            return;
        }

        try {
            const tournament = await Tournament.findById(req.body.tournamentId);
            if (tournament.stage != "sign-up") {
                res.status(401).json({ error: "Registration for this tournament has now closed." });
            }

            const userInfo = await verifyUser(req.headers.authorization);
            const playerExists = await Player.findOne({ 
                tournament: req.body.tournamentId,
                user: userInfo.user._id
            });

            if (playerExists) {
                const error = `User (${userInfo.user.firstName} ${userInfo.user.lastName}) already signed up for tournament`;
                console.log(error);
                res.status(400).json({ error });
                return;
            }

            const userCategories = [];
            
            for (let category of req.body.categories) {
                const databaseCategory = await Category.findOne({ 
                    tournament: req.body.tournamentId,
                    code: category
                });
                userCategories.push(databaseCategory._id);
            }

            const player = new Player({
                tournament: req.body.tournamentId,
                user: userInfo.user._id,
                male: req.body.gender === "male",
                categories: userCategories,
                seeded: req.body.seeded,
                ranking: 0,
            });

            await player.save();
            
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
        }
    })
]

exports.getUserTournaments = asyncHandler(async (req, res, next) => {
    try {
        const validateUser = await verifyUser(req.headers.authorization);
        const tournamentsHosting = await Tournament.find({ host: validateUser.user._id })
            .populate({
                path: "host",
                select: "firstName lastName"
            });
        const players = await Player.find({ user: validateUser.user._id });
        const tournamentsPlaying = [];
        for (let player of players) {
            const tournament = await Tournament.findById(player.tournament)
                .populate({
                    path: "host",
                    select: "firstName lastName"
                });
            tournamentsPlaying.push(tournament);
        }
        res.status(200).json({ tournamentsHosting, tournamentsPlaying })

    } catch (err) {
        console.log(err);
        res.sendStatus(403);
    }
});

exports.isValidCode = [
    body("tournamentCode")
        .trim()
        .escape()
        .isLength({ min: 11 }).withMessage("Tournament Code must be a minimum of 11 characters. Please check the code and try again."),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array())
            res.status(400).json({ message: "Validation Failed", errors: errors.array() })
            return;
        }

        try {
            const tournamentExists = await Tournament.findOne({ tournamentCode: req.body.tournamentCode })
                .populate("host", "firstName lastName").exec();
            if (tournamentExists) {
                if (tournamentExists.stage === "sign-up") {
                    res.status(200).json({ 
                        _id: tournamentExists._id, 
                        name: tournamentExists.name,
                        host: {
                            "name-long": tournamentExists.host.firstName + " " + tournamentExists.host.lastName
                        }
                    });
                } else {
                    console.log("Tournament " + tournamentExists._id + " is closed for registration.");
                    res.status(400).json({ error: `${tournamentExists.name} is closed for registration.` });
                }
                return;
            }
            console.log("Invalid Code");
            res.status(400).json({ error: "Tournament code is not valid" });
        } catch (err) {
            console.log("Server error TC0IVC " + err);
            res.status(500).json({ error: "Catch TC0IVC: " + err });
        }
    })
];

exports.getTournamentCategories = asyncHandler(async (req, res, next) => {
    try {
        const tournamentCategories = await Category.find({ tournament: req.headers.tournamentid });
        const categories = [];
        for (let obj of tournamentCategories) {
            categories.push(obj.code);
        }

        res.status(200).json({ categories });
    } catch (err) {
        console.log(err);
    }
});

// We could run this to END a tournament
exports.archiveTournament = [

];

// Let's hold off deleting a tournament for now... it's a bit too extreme
exports.deleteTournament = [

];

exports.getTournamentInfo = asyncHandler(async (req, res, next) => {
    try {
        const validateUser = await verifyUser(req.headers.authorization);
        const tournament = await Tournament.findById(req.headers.tournamentid)
            .populate({
                path: "host",
                select: "firstName lastName"
            });
        const tournamentMatches = await Match.find({ tournament: req.headers.tournamentid });
        const categories = await Category.find({ tournament: req.headers.tournamentid });
        const allPlayers = await Player.find({ tournament: req.headers.tournamentid });
        const userPlayer = await Player.findOne({ user: validateUser.user._id })
        const userTeams = await Team.find({ players: userPlayer })
            .populate({
                path: "players",
                select: "user -_id",
                populate: {
                    path: "user",
                    select: "firstName lastName -_id"
                },
            }).exec();
            
        const userMatches = userPlayer._id ? await Match.find({ participants: userPlayer._id }) : [];

        res.json({ 
            firstName: validateUser.user.firstName,
            lastName: validateUser.user.lastName,
            tournament,
            categories,
            host: validateUser.user._id == tournament.host._id,
            tournamentMatches,
            allPlayers: allPlayers.length,
            teams: userTeams,
            matches: userMatches,
        });
    } catch (err) {
        console.log("Server error TC0GTI " + err);
        res.status(500).json({ error: "Catch TC0GTI: " + err });
    }
});

exports.validateTournament = asyncHandler(async (req, res, next) => {
    try {
        const allCategories = await Category.find({ tournament: req.headers.tournamentid }); // returns array
        const invalid = [];
        for (let category of allCategories) {
            console.log(category._id)
            const players = await Player.find({ categories: { $in: category._id } });
            if (category.doubles) {
                if (players.length < 8) {
                    invalid.push(0);
                }
                if (players.length % 2 != 0) {
                    invalid.push(1);
                }
            } else {
                if (players.length < 4) {
                    invalid.push(2);
                }
            }

            if (category.code === "mixDoubles") {
                const malePlayers = players.filter((player) => player.male);
                const femalePlayers = players.filter((player) => !player.male);
                if (malePlayers.length != femalePlayers.length) {
                    invalid.push(3);
                }
            }
        }
        res.json({ invalid });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ 
            error: err.message,
        });
    }
});

exports.closeRegistration = asyncHandler(async (req, res, next) => {
    try {
        await Tournament.updateOne(
            { _id: req.headers.tournamentid },
            { $set: { stage: "play" }}
        );
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
    }
});

exports.endTournament = asyncHandler(async (req, res, next) => {
    try {
        await Tournament.updateOne(
            { _id: req.headers.tournamentid },
            { $set: { stage: "finished" }}
        );
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
    }
});