const express = require("express");
const router = express.Router();

const usersController = require("../Controllers/userController");

router.post("/sign-up", usersController.signUp);

router.post("/sign-in", usersController.signIn);

router.post("/forgot-password", usersController.forgotPassword);

router.post("/update-personal-details", usersController.updatePersonalDetails);

router.post("/update-password", usersController.updatePassword);

router.get("/verify", usersController.verify);

module.exports = router;