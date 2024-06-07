const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken")
const passport = require("../config/passport");
const router = express.Router();
const { body, validationResult } = require("express-validator");

exports.signIn = [
    body("email", "Email needs to be a valid email")
        .trim()
        .escape()
        .isEmail(),
    body("password")
        .trim(),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ message: "Validation Failed", errors: errors.array() });
            return;
        }

        passport.authenticate("user_local", (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                res.json({
                    error: "User not found"
                });
            } else {
                req.login(user, next); // Note that this assigns req.user to user. It is also a req, so we need a response in this line (otherwise we receive an error)
                jwt.sign({ user: user }, process.env.USER_KEY, { expiresIn: "10h" }, (err, token) => {
                    res.json({ token: token }); // We send this to the front end and save it in local storage
                });
            }
        })(req, res, next);
    })
];

exports.signUp = [
    // TODO: Add sign up and backend validation of all information. This is slightly more complex than previous sign-ups...
]


exports.verify = asyncHandler(async (req, res, next) => {
    try {
        await verifyUser(req.headers.authorization);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(403)
    }
});

module.exports = router;