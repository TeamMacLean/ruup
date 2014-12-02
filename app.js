var express = require('express');
var fs = require('fs');
var app = express();

var PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

fs.readdirSync('./controllers').forEach(function (file) {
    if(file.substr(-3) == '.js') {
        route = require('./controllers/' + file);
        route.controller(app);
    }
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.listen(PORT);
console.log('started server on port', PORT);

module.exports = app;
