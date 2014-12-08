var nodemailer = require('nodemailer');
var util = require('../lib/util');
var User = require('./user');
var config = require('../config.json');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.email.username,
        pass: config.email.password
    }
});

var email = this;

email.notifyDown = function (monitor) {
    User.findOne({_id: monitor.owner}, function (err, doc) {

        if (err) {
            return err;
        }
        var to = doc.email;
        var monitorName = monitor.name;
        var monitorURL = monitor.url;
        var downReason = 'unknown';

        var message = "Hi,\n" +
            "\n" +
            "The monitor " + monitorName + " (" + monitorURL + ") is currently DOWN (" + downReason + ").\n" +
            "\n" +
            "RUUP will alert you when it is back up.\n" +
            "\n" +
            "Cheers,\n" +
            "\n" +
            "RUUP\n" +
            "http://www.example.org\n" +
            "http://example.org";

        var mailOptions = {
            from: 'RUUP <alert@ruup.com>',
            to: to,
            subject: 'Monitor is DOWN:' + monitorName,
            text: message
        };
        send(mailOptions);
    });
};

email.notifyUp = function (monitor) {

    User.findOne({_id: monitor.owner}, function (err, doc) {

        if (err) {
            return err;
        }
        var to = doc.email;
        var monitorName = monitor.name;
        var monitorURL = monitor.url;
        var upResponse = 'unknown';
        var downTime = 'unknown';

        var message = "Hi,\n" +
            "\n" +
            "The monitor " + monitorName + " (" + monitorURL + ") is back UP (" + upResponse + ") (It was down for " + downTime + ").\n" +
            "\n" +
            "Cheers,\n" +
            "\n" +
            "RUUP";

        var mailOptions = {
            from: 'RUUP <alert@ruup.xyz>',
            to: to,
            subject: 'Monitor is UP: ' + monitorName,
            text: message
        };
        send(mailOptions);
    });
};

email.newUser = function (email) {

    var message = "Hi,\n" +
        "\n" +
        "Welcome to Are You Up (RUUP).\n" +
        "\n" +
        "Let us know if there is anything we can do to help you with the service.\n" +
        "\n" +
        "RUUP Team";

    var mailOptions = {
        from: 'RUUP <info@ruup.xyz>',
        to: email,
        subject: 'Welcome to Are You Up',
        text: message
    };
    send(mailOptions);
};

email.resetPassword = function (email, url) {
    var message = "Forgot your password?\n" +
        "\n" +
        "Click here " + url + " to reset it\n" +
        "\n" +
        "If you didn’t ask to reset your password, please ignore this email.\n" +
        "\n" +
        "RUUP Team";
    
    var mailOptions = {
        from: 'RUUP <info@ruup.xyz>',
        to: email,
        subject: 'Reset Your Password',
        text: message
    };
    send(mailOptions);
};

function send(mailOptions) {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            util.logInfo('Message sent: ' + info.response)
        }
    });
}

module.exports = email;