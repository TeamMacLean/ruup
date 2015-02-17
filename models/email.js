var util = require('../lib/util');
var User = require('./user');
var config = require('../config.json');

var mandrill = require('node-mandrill')(config.email.apikey);

var email = {};

var FROM_INFO = 'info@ruup.xyz';
var FROM_ALERT = 'alert@ruup.xyz';

email.notifyDown = function (monitor) {
    User.findOne({_id: monitor.owner}, function (err, doc) {

        if (err) {
            return err;
        }
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
            "http://www.ruup.xyz";

        var mailOptions = {
            message: {
                from_email: FROM_ALERT,
                from_name: 'RUUP',
                to: [
                    {email: doc.email, name: doc.email}
                ],
                subject: 'Monitor is DOWN:' + monitorName,
                text: message
            }
        };
        send(mailOptions);
    });
};

email.notifyUp = function (monitor) {

    User.findOne({_id: monitor.owner}, function (err, doc) {

        if (err) {
            return err;
        }
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
            "RUUP\n" +
            "http://www.ruup.xyz";

        var mailOptions = {
            message: {
                from_email: FROM_ALERT,
                from_name: 'RUUP',
                to: [
                    {email: doc.email, name: doc.email}
                ],
                subject: 'Monitor is UP: ' + monitorName,
                text: message
            }
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
        "RUUP\n" +
        "http://www.ruup.xyz";

    var mailOptions = {
        message: {
            from_email: FROM_INFO,
            from_name: 'RUUP',
            to: [
                {email: email, name: email}
            ],
            subject: 'Welcome to Are You Up',
            text: message
        }
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
        "RUUP\n" +
        "http://www.ruup.xyz";

    var mailOptions = {
        message: {
            from_email: FROM_INFO,
            from_name: 'RUUP',
            to: [
                {email: email, name: email}
            ],
            subject: 'Reset Your Password',
            text: message
        }
    };
    send(mailOptions);
};

function send(mailOptions) {

    console.log('sending email', mailOptions);

    mandrill('/messages/send',
        mailOptions, function (error, response) {
            if (error) util.logError('error', JSON.stringify(error));
            else util.logSuccess('success', response);
        });
}

module.exports = email;