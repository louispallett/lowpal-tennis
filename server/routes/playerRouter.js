const express = require("express");
const router = express.Router();

const playersController = require("../Controllers/playerController");
const player = require("../models/player");

router.get("/get-players", playersController.getPlayers);

router.get("/check-player-rankings", playersController.checkPlayerRankings);

router.get("/get-player-rankings", playersController.getPlayerRankings);

router.post("/update-player-rankings", playersController.updatePlayerRankings);

module.exports = router;