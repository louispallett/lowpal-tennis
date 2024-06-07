const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const logger = require('morgan');
const path = require("path");
const passport = require("passport");
const session = require("express-session");

require('dotenv').config();

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

// require("./config/passport.js");

app.use(passport.initialize());
app.use(passport.session());

/* TODO: Define routes here 
    app.use(
        // ....
    )
*/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
