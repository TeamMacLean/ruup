var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Monitor = require('./models/monitor');
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

//DB
var mongo = function () {
    var db = mongoose.connection;
    var dbURI = 'mongodb://localhost/ruup';
    db.on('error', function (error) {
        console.log('mongoose error', error);
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
    console.log('started server on port', PORT);
};

var initMonitors = function () {
    console.log('starting monitors');

    Monitor.find({}, function (err, monitors) {
        if (err) {
            console.log(err);
        }
        monitors.forEach(function (monitor) {
            monitor.curl();
            monitor.start();
        });
    })
};


routes();
mongo();
views();
start();
initMonitors();


module.exports = app;
