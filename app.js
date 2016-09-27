const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const routes = require('./routes');
const CONFIG = require('./config.json');
const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({secret: 'keyboard cat', resave: true, saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new GitHubStrategy({
        clientID: CONFIG.auth.clientID,
        clientSecret: CONFIG.auth.clientSecret,
        callbackURL: CONFIG.auth.callbackURL
    },
    function (accessToken, refreshToken, profile, cb) {
        // console.log(profile);
        return cb(null, profile);
    }
));
passport.serializeUser(function (user, cb) {
    cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});


app.use('/', routes);

app.use(function (req, res, next) {
    console.log('signed in user', req.user);
    next();
});


module.exports = server;