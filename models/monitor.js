var mongoose = require('mongoose');
var request = require('request');
var response = require('./response');
var util = require('../lib/util');
var email = require('./email');

var monitorScheme = mongoose.Schema({
    name: {type: String, required: true},
    url: {type: String, required: true},
    rate: {type: Number, required: true, min: 5, max: 1440},
    owner: {type: String, required: true},
    downNoticed: Boolean,
    downNotified: Boolean

});

function saveChanges(model) {
    model.save(model, function (err) {
        util.logInfo('error saving model', err);
    })
}

function isDown(err, response) {
    if (err) {
        return true;
    }
    return response.statusCode != 200;

}

function processDown(monitor) {
    if (monitor.downNoticed) {
        if (!monitor.downNotified) {
            monitor.downNotified = true;
            saveChanges(monitor);
            email.notifyDown(monitor);
        }
    } else {
        monitor.downNoticed = true;
        saveChanges(monitor);
    }
}

function processUp(monitor) {
    if (monitor.downNoticed) {
        monitor.downNoticed = false;
        saveChanges(monitor);
        if (monitor.downNotified) {
            monitor.downNotified = false;
            saveChanges(monitor);
            email.notifyUp(monitor);
        }
    }
}

monitorScheme.methods.curl = function () {
    var monitor = this;
    var id = monitor._id;
    var then = new Date().getTime();

    request(this.url, function (err, response) {

        var now = new Date().getTime();
        var time = now - then;

        if (isDown(err, response)) {
            processDown(monitor);
        } else {
            processUp(monitor);
        }

        var code = 'error';
        if (err) {
            time = 0;
        } else {
            code = response.statusCode
        }

        makeResponse(err, code, time, id)
    });
};

var makeResponse = function (err, code, time, monitor) {
    util.logInfo(time + 'ms');
    var responseBack = new response({
        code: code,
        time: time,
        monitor: monitor
    });
    responseBack.save(function (err) {
        if (err) {
            util.logError('ERROR', err);
        }
    });
};

monitorScheme.methods.start = function () {
    var monitor = this;
    util.logInfo('started monitoring', monitor.name);
    setInterval(function () {
        monitor.curl();
    }, this.rate * 60 * 1000);
};

monitorScheme.methods.getResponses = function (cb) {
    var monitor = this;
    response.find({monitor: monitor._id}).sort({date: 'desc'}).exec(cb);
};

monitorScheme.methods.removeResponses = function (cb) {
    var monitor = this;
    response.remove({monitor: monitor._id}).exec(cb);
};

var Monitor = mongoose.model('Monitor', monitorScheme);

module.exports = Monitor;

