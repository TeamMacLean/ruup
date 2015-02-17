var fs = require('fs');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Monitor = require('./models/monitor');
var passport = require('passport');
var util = require('./lib/util');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var routes = function () {
    app.use(express.static(__dirname + '/public'));
    fs.readdirSync('./controllers').forEach(function (file) {
        if (file.substr(-3) == '.js') {
            route = require('./controllers/' + file);
            route.controller(app);
        }
    });
};

var genSecret = function () {
    var secret = "", rand;
    for (var i = 0; i < 36; i++) {
        rand = Math.floor(Math.random() * 15);
        if (rand < 10) {
            // for 0-9
            secret += String.fromCharCode(48 + rand);
        } else {
            // for a-f
            secret += String.fromCharCode(97 + (rand - 10));
        }
    }
    return secret;
};

var middleware = function () {
    app.use(session({
        secret: genSecret(),
        cookie: {
            expires: false
        },
        //avoid nagging (these are the new values of express-session)
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function (req, res, next) {
        if (req.user != null && req.user.email != null) {
            res.locals.email = req.user.email;
        }
        next(null, req, res);
    });
};

//DB
var mongo = function () {
    var db = mongoose.connection;
    var dbURI = 'mongodb://localhost/ruup';
    db.on('error', function (error) {
        util.logError('mongoose error', error);
        mongoose.disconnect();
    });
    db.on('disconnected', function () {
        mongoose.connect(dbURI, {server: {auto_reconnect: true}});
    });
    mongoose.connect(dbURI, {server: {auto_reconnect: true}});
};

var views = function () {
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
};

var start = function () {
    var PORT = process.env.PORT || 8080;
    app.listen(PORT);
    util.logInfo('started server on port', PORT);
};

var initMonitors = function () {
    Monitor.find({}, function (err, monitors) {
        if (err) {
            console.log(err);
        }
        monitors.forEach(function (monitor) {


            //TODO enable if you want to test monitor manually
            if (monitor.type == Monitor.types.ping) {
                monitor.ping();
            } else if (monitor.type == Monitor.types.request) {
                monitor.curl();
            }

            monitor.start();
        });
    })
};

middleware();
mongo();
routes();
views();
start();
initMonitors();


module.exports = app;
