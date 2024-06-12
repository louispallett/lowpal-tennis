const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require('morgan');
const path = require("path");
const passport = require("passport");
const session = require("express-session");

const indexRouter = require("./routes/indexRouter.js");
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

app.use("/api", indexRouter);
app.use("/api/users", usersRouter);

module.exports = app;