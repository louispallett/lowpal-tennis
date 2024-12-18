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
            \nYour password has been reset to: ${newPassword}`
            // \nIf you wish to change your password, please login to your account with your new password and navigate to your account settings via the site menu.`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

exports.changePassword = asyncHandler(async (req, res, next) => {
    // First, verify user (this will also find their info)

    // Confirm their old password is correct (we'll have to use passport.authenticate as we did in sign-up)

        // If not, return errors (we can deal with this on the front end the same as we did in the SignUp component)
        // if (err) return next(err);
        // if (!user) {
        //     res.json({ error: info.message });
        // } else {
        //     // Run bcrypt hash function
                
        //         // Update password in database with new hashed password

        //         // return 200
        // }
});

exports.verify = asyncHandler(async (req, res, next) => {
    try {
        const user = await verifyUser(req.headers.authorization);
        res.json({ 
            userId: user.user._id,
            email: user.user.email,
            firstName: user.user.firstName,
            categories: user.user.categories
         });
    } catch (err) {
        console.log(err);
        res.status(403).json(err);
    }
});