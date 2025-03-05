const express = require("express");
const router = express.Router();

const playersController = require("../Controllers/playerController");

router.get("/get-players", playersController.getPlayers);

module.exports = router;