/* 
========================
SERVER SIDE TODO LIST 
========================

- Return information for the client side home page (fetching user via verifyUser and finding their relevant matches)
- Return information for the client side specific match (can use _id provided)
- POST method for updating match scores
- GET method for fetching matches for specific category (results pages)
- Any final clean up

*/

const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require('morgan');
const path = require("path");
const passport = require("passport");
const session = require("express-session");

const bracketRouter = require("./routes/bracketRouter.js");
const dashboardRouter = require("./routes/dashboardRouter.js");
const matchRouter = require("./routes/matchRouter.js");
const usersRouter = require("./routes/usersRouter");

require('dotenv').config();

require("./database/mongoConfig.js");

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

require("./config/passport.js");

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/brackets", bracketRouter);
app.use("/api/dashboard/:userId", dashboardRouter);
app.use("/api/users", usersRouter);
app.use("/api/match", matchRouter);

module.exports = app;