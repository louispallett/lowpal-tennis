const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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

        console.log(req.body)

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
            // Loop through the filtered categories and create category instances
            console.log(categories)
            const tournament = new Tournament({
                name: req.body.tournamentName,
                host: null,
                stage: "sign-up",
                startDate: new Date()
            });
            const newTournament = await tournament.save();

            for (let category of categories) {
                const newCategory = new Category({
                    name: category.name,
                    tournament: newTournament._id
                });
                const savedCategory = await newCategory.save();
                // Then push the category _id to categoryList array
                categoryList.push(savedCategory._id);
            }


            res.json({ tournamentCode: newTournament._id });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Catch TC00CT: " + err});
        }
    })
];

// We could run this to END a tournament
exports.archiveTournament = [

];

// Let's hold off deleting a tournament for now... it's a bit too extreme
exports.deleteTournament = [

];