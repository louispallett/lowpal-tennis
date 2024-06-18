const express = require("express");
const router = express.Router();

const matchController = require("../Controllers/matchController");

router.get("/:matchId", matchController.get_match);

router.post("/teams/create", matchController.create_teams);

router.post("/create", matchController.create_matches);

router.post("/:categoryId/matches/:matchId/update", matchController.post_match_results);

module.exports = router;