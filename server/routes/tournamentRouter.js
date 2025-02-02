const express = require("express");
const router = express.Router();

const tournamentController = require("../Controllers/tournamentController");

router.post("/create-tournament", tournamentController.createTournament);

router.post("/archive-tournament", tournamentController.archiveTournament);

router.post("/delete-tournament", tournamentController.deleteTournament);

module.exports = router;