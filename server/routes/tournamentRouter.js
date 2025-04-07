const express = require("express");
const router = express.Router();

const tournamentController = require("../Controllers/tournamentController");

router.post("/create-tournament", tournamentController.createTournament);

router.post("/join-tournament", tournamentController.joinTournament);

router.post("/is-valid-code", tournamentController.isValidCode);

router.get("/get-tournament-categories", tournamentController.getTournamentCategories);

router.post("/archive-tournament", tournamentController.archiveTournament);

router.post("/delete-tournament", tournamentController.deleteTournament);

router.get("/get-tournament-info", tournamentController.getTournamentInfo);

router.get("/get-user-tournaments", tournamentController.getUserTournaments);

router.get("/validate-tournament", tournamentController.validateTournament);

router.put("/update-tournament-stage", tournamentController.updateTournamentStage);

router.post("/end-tournament", tournamentController.endTournament);

module.exports = router;