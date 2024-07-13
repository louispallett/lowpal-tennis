const express = require("express");
const router = express.Router();

const bracketController = require("../Controllers/bracketController");

// Since these brackets are fixed, it might not be necessary to fetch them? They could be 
// a static page with all 5 categories on (just to save requests to the server)
// router.get("/", bracketController.get_categories);

router.get("/", bracketController.get_bracket_categories);

// Bracket for category
router.get("/:categoryId", bracketController.get_bracket);

// Get specific match detail
// If we perfect the React Tournament Bracket library, this may not be necessary!
router.get("/:categoryId/bracket/:matchId", bracketController.get_match_detail);

module.exports = router;