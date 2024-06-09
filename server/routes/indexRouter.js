const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();

router.get("/about", asyncHandler(async (req, res, next) => {
    res.json({
        message: "This is the about section"
    })
}));

module.exports = router;