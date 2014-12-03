var mongoose = require('mongoose');
var request = require('request');
var Response = require('./response');

var monitorScheme = mongoose.Schema({
    name: {type: String, required: true},
    url: {type: String, required: true},
    rate: {type: Number, required: true}
//    createdAt: Date,
//    updatedAt: Date
});

monitorScheme.methods.curl = function () {
    var id = this._id;
    var then = new Date().getTime();
    request(this.url, function (err, response) {

        var now = new Date().getTime();
        var time = now - then;

        var status = 'error';
        if (err) {
            time = 0;
        } else {
            status = response.statusCode
        }

        makeResponse(err, status, time, id)
    });
};

var makeResponse = function (err, code, time, monitor) {
    console.log(time + 'ms');
    var response = new Response({
        code: code,
        time: time,
        monitor: monitor
    });
    response.save(function (err) {
        if (err) {
            console.log('ERROR', err);
        }
    });
};

monitorScheme.methods.start = function () {
    var monitor = this;
    var the_interval = this.rate * 60 * 1000;
    setInterval(function () {
        monitor.curl();
    }, the_interval);
};

monitorScheme.methods.getResponses = function (cb) {
    var monitor = this;
    Response.find({monitor: monitor._id}).sort({date: 'desc'}).exec(cb);
};

var Monitor = mongoose.model('Monitor', monitorScheme);

module.exports = Monitor;

