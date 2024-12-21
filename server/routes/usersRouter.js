const express = require("express");
const router = express.Router();

const usersController = require("../Controllers/usersController");

/* Note that we can keep these for now, but when in production, we will have to have either sign-up or sign-in - because
we'll want the users to sign-up first, then, once we've signed everyone up, we can remove the sign-up and just have the 
sign-in. We can do this primarly on the frontend though.
 */

router.post("/sign-in", usersController.signIn);

router.post("/sign-up", usersController.signUp);

router.post("/forgot-password", usersController.forgotPassword);

router.post("/update-personal-details", usersController.updatePersonalDetails);

router.post("/update-password", usersController.updatePassword);

router.get("/verify", usersController.verify);

module.exports = router;