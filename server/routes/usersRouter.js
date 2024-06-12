const express = require("express");
const router = express.Router();

const usersController = require("../Controllers/usersController");

router.post("/sign-in", usersController.signIn);

router.post("/sign-up", usersController.signUp);

router.get("/verify", usersController.verify);

module.exports = router;