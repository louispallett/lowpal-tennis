const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const passport = require("../config/passport");
const { body, validationResult } = require("express-validator");

const User = require("../models/user");

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
            res.sendStatus(400).json({ message: "Validation Failed", errors: errors.array() });
            return;
        }

        passport.authenticate("user_local", (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                res.status(400).json({ error: info.message });
            } else {
                req.login(user, next); // Note that this assigns req.user to user. It is also a req, so we need a response in this line (otherwise we receive an error)
                jwt.sign({ user }, process.env.USER_KEY, { expiresIn: "10h" }, (err, token) => {
                    res.json({ token, userId: user._id }); // We send this to the front end and save it in local storage
                });
            }
        })(req, res, next);
    })
];

exports.signUp = [
    body("firstName")
        .trim()
        .escape(),
        // .length({ min: 1, max: 50 }),
    body("lastName")
        .trim()
        .escape(),
        // .length({ min: 1, max: 50 }).withMessage("Last name cannot be more than 50 characters"),
    body("email")
        .trim()
        .isEmail().withMessage("Email needs to be a valid email")
        .escape(),
    body("mobile")
        .trim()
        .custom(value => value.replace(/\s*/g, "")
        .match(/^0([1-6][0-9]{8,10}|7[0-9]{9})$/)).withMessage("Please enter a valid phone number"),
    body("password")
        .trim(),

    asyncHandler(async (req, res, next) => {
        const userExists = await User.findOne({ email: req.body.email.toLowerCase() }, "email").exec();
        if (userExists) {
            res.json({ errors: "Email already used for another account" });
            return;
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: "Validation Failed", errors: errors.array() })
            return;
        }

        try {
            bcrypt.hash(req.body.password, 15, async (err, hashedPassword) => {
                if (err) {
                    console.log(err);
                }
                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email.toLowerCase(),
                    mobile: req.body.mobile,
                    male: req.body.gender == "male" ? true : false,
                    // As this is a required field, we don't need to check for it's type before converting it into an array
                    categories: req.body.categories,
                    seeded: req.body.seeded,
                    password: hashedPassword,
                });
                await user.save();
                res.sendStatus(200);
            });
        } catch (err) {
            return next(err);
        }
    })
];

exports.verify = asyncHandler(async (req, res, next) => {
    try {
        await verifyUser(req.headers.authorization);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(403)
    }
});