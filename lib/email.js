const nodemailer = require('nodemailer');
const config = require('../config.json');

var Email = {};

var transporter = nodemailer.createTransport(`${config.email.protocol}://${config.email.username}:${config.email.password}@${config.email.server}`);


Email.isUp = (monitor, response, timeDate) => {
    var email = monitor.email;
    var subject = `ALERT ${monitor.name} is down!`;
    var text = `site ${monitor.name} came back up at ${timeDate}`;
    var html = `<p>${text}</p>`;
    Email.sendEmail(email, subject, text, html);
};

Email.isDown = (monitor, response, timeDate)=> {
    var email = monitor.email;
    var subject = `${monitor.name} is back online!`;
    var text = `site ${monitor.name} went down at ${timeDate}`;
    var html = `<p>${text}</p>`;
    Email.sendEmail(email, subject, text, html);
};

Email.sendEmail = (to, subject, text, html) => {
    var mailOptions = {
        from: '"RUUP" <info@ruup.online>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plaintext body
        html: html // html body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};

module.exports = Email;