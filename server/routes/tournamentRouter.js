const express = require("express");
const router = express.Router();

const tournamentController = require("../Controllers/tournamentController");

router.post("/create-tournament", tournamentController.createTournament);

router.post("/join-tournament", tournamentController.joinTournament);

router.post("/is-valid-code", tournamentController.isValidCode);

router.post("/archive-tournament", tournamentController.archiveTournament);

router.post("/delete-tournament", tournamentController.deleteTournament);

router.get("/get-tournament-info", tournamentController.getTournamentInfo);

router.get("/get-user-tournaments", tournamentController.getUserTournaments);

module.exports = router;