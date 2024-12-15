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
 * # Updates needed #
 *
 * TODO: Add proper error handling, returning messages to the client
 * TODO: Restructure this file to ideally ONLY contain POST and GET requests, moving auxillary 
 * functions to seperate files. This includes:
 * 	- email confirmation functions
 * 	- adding user to categories
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

const transporter = require("../config/nodemailerConfig");
const verifyUser = require("../config/verifyUser");
const User = require("../models/user");
const Category = require("../models/category");

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
                jwt.sign({ user }, process.env.USER_KEY, { expiresIn: "10h" }, (err, token) => {
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
    body("mobile")
        .trim()
        .custom(value => value.replace(/\s*/g, "")
        .match(/([1-6][0-9]{8,10}|7[0-9]{9})$/)).withMessage("Please enter a valid phone number"),
    body("password")
        .trim(),

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
            return next(err);
        }
    })
];

const sendConfirmationEmail = (user, categoryNames) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "2024 Saltford In-House Tennis Tournament",
        text: `Hi ${user.firstName}, 
            \nThanks you for signing up to the 2024 Saltford In-House Tournament. This email confirms that your sign up in the following categories:
            \n${categoryNames}
            \nTeams and matches will be announced on Friday 26th July. Until then, please feel free to reply to this email with any questions you have.
            \nBest wishes,\nLouis`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            // TODO: Throw a new error here to trigger the catch error
            // throw error...
        } else {
            console.log("Email sent: " + info.response);
        }
    })
}

const addUserToCategories = async (userId, userCategories) => {
    try {
        for (const userCategory of userCategories) {
            await Category.findByIdAndUpdate(
                userCategory,
                { $push: { players: userId } },
                { new: true, useFindAndModify: false } // Ensures we get the updated document back and avoid deprecation warnings
            );
        }
    } catch (error) {
        console.log(error);
    }
}

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    try {
        let user = await User.find({ email: req.body.email });
        user = user[0];
        console.log(user);
        if (!user) {
            res.json({ error: "Account not found" });
            return;
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
                console.log(err)
                res.json({ error: "Server error. CODE UF100." });
                return;
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
        res.json({ error: "Server error. CODE UF100." });
        return;
    }
});

const sendResetPasswordEmail = (user, newPassword) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "2024 Saltford In-House Tennis Tournament",
        text: `Hi ${user.firstName}, 
            \nThanks you for requesting to reset your password.
            \nYour password has been reset to: ${newPassword}
            \nIf you wish to change your password, please login to your account with your new password and navigate to the account settings via the site menu.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            // TODO: Throw a new error here to trigger the catch error
            // throw error...
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

exports.updateName = [
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

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: "Validation Failed", errors: errors.array() })
            return;
        }

        try {
            let user = await User.findById(req.body.id);
            if (!user) {
                res.status(500).json({ error: "Account not found. Code UC####"});
                return;
            }

            await User.updateOne(
                { _id: user.id },
                { $set: { firstName: req.body.firstName, lastName: req.body.lastName } }
            );
            
            res.sendStatus(200);
        } catch (err) {
            console.log(err);

        }
    })
];

exports.updateEmail = [
    body("email")
    .trim()
    .isEmail().withMessage("Email needs to be a valid email")
    .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: "Validation Failed", errors: errors.array() });
            return;
        }

        try {
            let user = await User.findById(req.body.id);
            if (!user) {
                res.status(500).json({ error: "Account not found. Code UC####"});
                return;
            }

            await User.updateOne(
                { _id: user.id },
                { $set: { email: req.body.email }}
            );

            sendUpdateEmailEmail(user, req.body.email);

            res.sendStatus(200);
        } catch (err) {
            console.log(err);

        }
    })
];

// Note that we have to pass in the req.body.email here because the user.email will 
// be the old one (since the fetch request to the database was made before updating
// the email there)
const sendUpdateEmailEmail = (user, newEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: newEmail,
        subject: "LowPal Tennis: Email Updated",
        text: `Hi ${user.firstName},
            \nThank you for requesting a change to your email address. This email confirms that you have updated your address to ${newEmail}.
            \nIf you did not make this request, please respond to this email immediately and let us know.
            \nBest wishes,
            Louis`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            // TODO: Throw a new error here to trigger the catch error
            // throw error...
        } else {
            console.log("Email send: " + info.response);
        }
    })
}

exports.updateMob = [
    body("mobile")
    .trim()
    .custom(value => value.replace(/\s*/g, "")
    .match(/([1-6][0-9]{8,10}|7[0-9]{9})$/)).withMessage("Please enter a valid phone number"),

    asyncHandler(async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                res.status(400).json({ message: "Validation Error", errors: errors.array()});
                return;
            }

            let user = await User.findById(req.body.id);
            
            if (!user) {
                res.status(500).json({ error: "Account not found. Code UC####"});
                return;
            }

            await User.updateOne(
                { _id: user.id },
                { $set: { mobile: req.body.mobile }}
            );

            res.sendStatus(201);

        } catch (err) {
            console.log(err);

        }
    })
];

exports.updatePassword = [
    body("password")
        .trim(),
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
                res.status(500).json({ error: "Account not found. Code UC####"});
                return;
            }

            bcrypt.hash(req.body.password, 15, async (err, hashedPassword) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Hash error. Code UC####.", error: err });
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
            res.status(500).json({ error: "Code UC####: " + err});
        }

    })
];

const sendUpdatePasswordEmail = (user) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "LowPal Tennis: Reset password confirmation",
        text: `Hi ${user.firstName},
            \nYou are receieving this email because a successful request was made to reset your password.
            \nIf you did not make this request, please respond this to email immediately.`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

exports.verify = asyncHandler(async (req, res, next) => {
    try {
        const user = await verifyUser(req.headers.authorization);
        res.json({ 
            userId: user.user._id,
            email: user.user.email,
            firstName: user.user.firstName,
            lastName: user.user.lastName,
            categories: user.user.categories
        });
    } catch (err) {
        console.log(err);
        res.status(403).json(err);
    }
});
