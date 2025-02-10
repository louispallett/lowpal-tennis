const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const generator = require("generate-password");

const Tournament = require("../models/tournament");
const Category = require("../models/category");
// const User = require("../models/user");
// const Match = require("../models/match");

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
            ]

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
                tournamentCode: tournamentCode,
                host: null,
                stage: "sign-up",
                startDate: new Date()
            });
            const newTournament = await tournament.save();
            
            // Loop through the filtered categories and create category instances
            for (let category of categories) {
                const newCategory = new Category({
                    name: category.name,
                    code: category.code,
                    tournament: newTournament._id,
                    players: []
                });
                const savedCategory = await newCategory.save();
                // Then push the category _id to categoryList array
                categoryList.push(savedCategory._id);
            }

            res.json({ tournamentId: newTournament._id, tournamentCode: newTournament.tournamentCode });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Catch TC00CT: " + err});
        }
    })
];

exports.assignTournamentHost = [
    body("hostId")
        .trim()
        .escape()
        .isLength({ min: 1 }),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array())
            res.status(400).json({ message: "Validation Failed", errors: errors.array() })
            return;
        }

        try {
            await Tournament.updateOne(
                { _id: req.body.tournamentId },
                { $set: { host: req.body.hostId } }
            );
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Catch TC0ATH: " + err });
        }
    })
];

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
                
                console.log(tournamentExists.host.firstName + " " + tournamentExists.host.lastName);
                res.status(200).json({ 
                    tournamentId: tournamentExists._id, 
                    name: tournamentExists.name,
                    hostName: tournamentExists.host.firstName + " " + tournamentExists.host.lastName
                });
                return;
            }
            console.log("Invalid Code");
            res.status(400).json( { error: "Tournament code is not valid" });
        } catch (err) {
            console.log("Server error TC0IVC " + err);
            res.status(500).json({ error: "Catch TC0IVC: " + err });
        }
    })
];

// We could run this to END a tournament
exports.archiveTournament = [

];

// Let's hold off deleting a tournament for now... it's a bit too extreme
exports.deleteTournament = [

];

exports.getTournamentInfo = asyncHandler(async (req, res, next) => {
    const tournament = await Tournament.findById(req.body.tournamentId);
    console.log(tournament);
});