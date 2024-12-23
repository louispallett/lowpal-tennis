/* ----------------------------------------------------------------------------------------------------
 * userController.js
 * ====================================================================================================
 * This file contains all our GET and POST functions for user account related requests:
 * - sign up
 * - sign in
 * - update details:
 *   	- name (first and last)
 *   	- email
 *   	- mobile
 *   	- password
 * - verifying the user's jsonwebtoken
 *
 * Note that adding user to categories may be bad design. We should probably restructure how we design 
 * this so that adding user to the categories is ultimately unnecessary.
 * ----------------------------------------------------------------------------------------------------
*/

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const generator = require("generate-password");
const jwt = require("jsonwebtoken")
const passport = require("../config/passport");
const { body, validationResult } = require("express-validator");

const verifyUser = require("../config/verifyUser");
const User = require("../models/user");

const { sendConfirmationEmail, 
    addUserToCategories, 
    sendResetPasswordEmail, 
    sendUpdateEmailEmail, 
    sendUpdatePasswordEmail 
} = require("../public/scripts/userAuxillary");

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
            console.log(errors.array());
            res.json({ message: "Validation Failed", errors: errors.array() });
            return;
        }

        passport.authenticate("user_local", (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                res.json({ error: info.message });
            } else {
                req.login(user, next); // Note that this assigns req.user to user. It is also a req, so we need a response in this line (otherwise we receive an error)
                jwt.sign({ user }, process.env.USER_KEY, { expiresIn: "24h" }, (err, token) => {
                    res.json({ token }); // We send this to the front end and save it in local storage
                });
            }
        })(req, res, next);
    })
];

exports.signUp = [
    body("firstName")
        .trim()
        .escape()
        .isLength({ min: 1, max: 50 }),
    body("lastName")
        .trim()
        .escape()
        .isLength({ min: 1, max: 50 }).withMessage("Last name cannot be more than 50 characters"),
    body("email")
        .trim()
        .isEmail().withMessage("Email needs to be a valid email")
        .escape(),
    body("mobCode")
        .trim()
        .escape(),
    body("mobile")
        .trim()
        .custom(value => value.replace(/\s*/g, "")
        .match(/([1-6][0-9]{8,10}|7[0-9]{9})$/)).withMessage("Please enter a valid phone number"),
    body("password")
        .trim()
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false
        }).withMessage("Password not strong enough"),

    asyncHandler(async (req, res, next) => {
        const userExists = await User.findOne({ email: req.body.email.toLowerCase() }, "email").exec();
        if (userExists) {
            res.status(400).json({ errors: [{ msg: "Email already used for another account" }]});
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
                    throw new Error(`Hashing error. Code UC0001- ${err}`);
                }
                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email.toLowerCase(),
                    mobCode: req.body.mobCode,
                    mobile: req.body.mobile,
                    male: req.body.gender == "male" ? true : false,
                    // As this is a required field, we don't need to check for it's type before converting it into an array
                    categories: req.body.categories,
                    seeded: req.body.seeded,
                    password: hashedPassword,
                    ranking: 0,
                });
                
                const newUser = await user.save();
                await addUserToCategories(newUser._id, newUser.categories)
                
                const newUserCategories = await User.findById(newUser._id).populate({ path: "categories", select: "name -_id" });
                const categoryNames = newUserCategories.categories.map(category => category.name).join('\n');                
                
                sendConfirmationEmail(user, categoryNames); 
                
                res.sendStatus(200);
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Catch UC00SU: " + err});
        }
    })
];

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    try {
        let user = await User.find({ email: req.body.email });
        user = user[0];
        console.log(user);
        if (!user) {
            console.log(`User ${req.body.id} not found!`);
            throw new Error("Account not found. Code UC0001");
        }
        const newPassword = generator.generate({
            length: 15,
            numbers: true,
            symbols: true,
            exclude: "'\"`;_@,.-{}[]~#\\|¬",
            strict: true
        });

        bcrypt.hash(newPassword, 15, async (err, hashedPassword) => {
            if (err) {
                console.log(err);
                throw new Error(`Code UC0002 - ${err}`);
            }
            await User.updateOne(
                { _id: user._id },
                { $set: { password: hashedPassword } }
            );
        });

        sendResetPasswordEmail(user, newPassword);
        res.json({ msg: "Success" });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Catch UC00FP: " + err});
    }
});

exports.updatePersonalDetails = [
    body("firstName")
        .trim()
        .escape()
        .isLength({ min: 1 }).withMessage("First name must be at least 1 character")
        .isLength({ max: 50 }).withMessage("First name cannot be more than 50 characters"),
    body("lastName")
        .trim()
        .escape()
        .isLength({ min: 1 }).withMessage("Last name must be at least 1 character")
        .isLength({ max: 50 }).withMessage("Last name cannot be more than 50 characters"),
    body("email")
        .trim()
        .isEmail().withMessage("Email needs to be a valid email")
        .escape(),
    body("mobCode")
        .trim()
        .escape(),
    body("mobile")
        .trim()
        .custom(value => value.replace(/\s*/g, "")
        .match(/([1-6][0-9]{8,10}|7[0-9]{9})$/)).withMessage("Please enter a valid phone number"),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            res.status(400).json({ message: "Validation Error", errors: errors.array() });
            return;
        }
        
        try {
            const user = await User.findById(req.body.id);

            if (!user) {
                console.log(`User ${req.body.id} not found!`);
                throw new Error("Account not found. Code UC0001");
            }

            await User.updateOne(
                { _id: user.id },
                { $set: { 
                    firstName: req.body.firstName, 
                    lastName: req.body.lastName,
                    email: req.body.email.toLowerCase(),
                    mobCode: req.body.mobCode,
                    mobile: req.body.mobile
                }}
            );

            // Only send update email if email submitted does not match user email
            // (done last in case of any database errors which may stop this)
            if (user.email !== req.body.email.toLowerCase()) {
                sendUpdateEmailEmail(user, req.body.email);
            }
            res.sendStatus(201);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Catch UC0UPD: " + err});
        }
    })

]

exports.updatePassword = [
    body("password")
        .trim()
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false
        }).withMessage("Password not strong enough"),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            res.status(400).json({ message: "Validation Error", errors: errors.array()});
            return;
        }

        try {
            let user = await User.findById(req.body.id);
            if (!user) {
                console.log(`User ${req.body.id} not found!`);
                throw new Error("Account not found. Code UC0001");
            }

            bcrypt.hash(req.body.password, 15, async (err, hashedPassword) => {
                if (err) {
                    console.log(err);
                    throw new Error(`Code UC0002 - ${err}`);
                }

                await User.updateOne(
                    { _id: user.id },
                    { $set: { password: hashedPassword }}
                );
            });
            
            sendUpdatePasswordEmail(user);
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Catch UC00UP: " + err});
        }

    })
];

exports.verify = asyncHandler(async (req, res, next) => {
    try {
        const user = await verifyUser(req.headers.authorization);
        res.json({ 
            userId: user.user._id,
            email: user.user.email,
            firstName: user.user.firstName,
            lastName: user.user.lastName,
            mobile: user.user.mobile,
            categories: user.user.categories
        });
    } catch (err) {
        console.log(err);
        res.status(403).json(err);
    }
});