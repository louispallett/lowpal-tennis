const User = require("../models/user");
const Tournament = require("../models/tournament");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const replaceEncodedCharacters = require("../public/javascripts/encodedChar");

exports.user_create_post = [
    body("firstName", "First Name must be at least 2 letters long")
        .trim()
        .isLength({ min: 2})
        .escape(),
    body("lastName", "Last Name must be at least 2 letters long")
        .trim()
        .isLength({ min: 2})
        .escape(),
    body("gender")
        .trim()
        .isLength({ min: 4})
        .escape(),
    // Maybe... just to check they've signed up to at least one?!
    body("tournament", "You must pick at least one tournament")
        .trim()
        .escape(),
    // More validation on this (valid email etc.)
    body("email", "Must be a valid email address!")
        .trim()
        .isLength({ min: 2})
        .normalizeEmail()
        .escape(),
    body("password", "Password must not be empty")
        .trim()
        // There are some other validations we should do do along with UI feedback - 
        // the method below validates a minlength of 8, and at least one lowercase, uppercase, number, 
        // and symbol
        .isStrongPassword()
        // We SHOULDN'T escape() our password as it's hashed, so there isn't a risk of SQL injection.

        // DON'T Validate confpassword - we don't need to!
]