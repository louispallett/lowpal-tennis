const express = require("express");
const router = express.Router();

const teamController = require("../Controllers/teamController");

router.get("/get-teams", teamController.getTeams);

router.post("/create-teams", teamController.createTeams);

module.exports = router;