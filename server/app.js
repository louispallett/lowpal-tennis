bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const express = require("express");
const helmet = require("helmet")
const logger = require('morgan');
const path = require("path");
const passport = require("passport");
const RateLimit = require("express-rate-limit");
const session = require("express-session");

// const bracketRouter = require("./routes/bracketRouter.js");
// const dashboardRouter = require("./routes/dashboardRouter.js");
// const matchRouter = require("./routes/matchRouter.js");
const usersRouter = require("./routes/usersRouter");
const tournamentRouter = require("./routes/tournamentRouter");
const categoryRouter = require("./routes/categoryRouter.js");

require('dotenv').config();

require("./database/mongoConfig.js");

const limiter = RateLimit({
    windowMs: 1 *  60 * 1000,
    max: 75,
});  

const app = express();

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "POST, GET");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     next();
// });

app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             "default-src": ["'self'", "'https://lowpal-tennis-server.fly.dev/favicon.ico'"],
//             "script-src": ["'self'", "'unsafe-inline'"], // Removed cloudinary here - may use it later
//             "img-src": ["'self'", "https://lowpal-tennis-server.fly.dev/favicon.ico"] // Removed cloudinary here - may use it later
//         },
//     }),
// );
app.use(logger('dev'));
app.use(limiter);
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

require("./config/passport.js");

app.use(passport.initialize());
app.use(passport.session());

// app.use("/api/brackets", bracketRouter);
// app.use("/api/dashboard/:userId", dashboardRouter);
app.use("/api/users", usersRouter);
app.use("/api/tournaments", tournamentRouter)
app.use("/api/categories", categoryRouter);
// app.use("/api/match", matchRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));