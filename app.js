const path = require("path");
const express = require('express');
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const expressSession = require("express-session");

const app = express();

const indexRouter = require("./routes/indexRouter");
const hisaabRouter = require("./routes/hisaabRouter");

// Session configuration
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: "jgsdhdjknsmncxkdsflfejfekfbwejhvfhwgc",
        cookie: {
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    })
);

app.use(flash());

app.use((req, res, next) => {
    res.locals.successMessages = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.use('/', indexRouter);
app.use('/hisaab', hisaabRouter);

app.listen(process.env.PORT || 3000);