const express = require("express");
const router = express.Router();

const tournamentController = require("../Controllers/tournamentController");

router.post("/create-tournament", tournamentController.createTournament);

router.post("/assign-tournament-host", tournamentController.assignTournamentHost);

router.post("/is-valid-code", tournamentController.isValidCode);

router.post("/archive-tournament", tournamentController.archiveTournament);

router.post("/delete-tournament", tournamentController.deleteTournament);

router.get("/tournament-get-info", tournamentController.getTournamentInfo);

module.exports = router;