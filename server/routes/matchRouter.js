const express = require("express");
const router = express.Router();

const matchController = require("../Controllers/matchController");

router.get("/matches", matchController.getMatches);

router.get("/:matchId", matchController.getMatch);

// router.get("/:matchId/contactDetails", matchController.get_contact_details);

router.post("/create", matchController.createMatches);

// router.post("/matches/:matchId/update", matchController.post_match_results);

module.exports = router;