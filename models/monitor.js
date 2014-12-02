var mongoose = require('mongoose');

var monitorScheme = mongoose.Schema({
    name: {type: String, required: true},
    url: {type: String, required: true},
    ip: {type: String, required: true},
    https: {type: Boolean, required: true},
    rate: {type: Number, required: true},
    createdAt: Date,
    updatedAt: Date
});


monitorScheme.methods.curl = function () {
    var PORT = 80;
    if (this.https) {
        PORT = 443;
    }

    var http = require('http');
    var options = {
        host: url,
        port: PORT
    };
    http.get(options, function (resp) {
//        resp.on('data', function (chunk) {
        //do something with chunk
        console.log('its good', resp);
//        });
    }).on("error", function (e) {
        console.log("Got error: " + e.message);
    });
};

var Monitor = mongoose.model('Monitor', monitorScheme);

module.exports = Monitor;

