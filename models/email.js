var nodemailer = require('nodemailer');
var util = require('../lib/util');
var User = require('./user');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: '',
        pass: ''
    }
});


function notifyDown(monitor) {
    User.findOne({_id: monitor.owner}, function (err, doc) {

        if (err) {
            return err;
        }
        var to = doc.email;
        var monitorName = monitor.name;
        var monitorURL = monitor.url;
        var downReason = 'unknown';

        var message = "Hi,\n\nThe monitor " + monitorName + " (" + monitorURL + ") is currently DOWN (" + downReason + ").\n\nRUUP will alert you when it is back up.\n\nCheers,\n\nRUUP\nhttp://www.example.org\nhttp://example.org";

        var mailOptions = {
            from: 'RUUP <alert@ruup.com>',
            to: to,
            subject: 'Monitor is DOWN:' + monitorName,
            text: message
        };
        send(mailOptions);
    });
}

function notifyUp(monitor) {

    User.findOne({_id: monitor.owner}, function (err, doc) {

        if (err) {
            return err;
        }
        var to = doc.email;
        var monitorName = monitor.name;
        var monitorURL = monitor.url;
        var upResponse = 'unknown';
        var downTime = 'unknown';

        var message = "Hi,\n\nThe monitor " + monitorName + " (" + monitorURL + ") is back UP (" + upResponse + ") (It was down for " + downTime + ").\n\nCheers,\n\nRUUP\nhttp://www.example.org\nhttp://example.org";

        var mailOptions = {
            from: 'RUUP <alert@ruup.com>',
            to: to,
            subject: 'Monitor is UP: ' + monitorName,
            text: message
        };
        send(mailOptions);
    });
}

function send(mailOptions) {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            util.logInfo('Message sent: ' + info.response)
        }
    });
}

module.exports = {
    notifyDown: notifyDown,
    notifyUp: notifyUp
};