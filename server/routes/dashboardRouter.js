const express = require("express");
const router = express.Router({ mergeParams: true });

const dashboardController = require("../Controllers/dashboardController");

router.get("/", dashboardController.get_categories);

module.exports = router;