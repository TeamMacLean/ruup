const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const EmailTemplate = require('email-templates').EmailTemplate;
const path = require('path');
const templatesDir = path.resolve(__dirname, '..', 'views', 'email');
const config = require('../config.json');

var Email = {};

const from = '"RUUP" <info@ruup.online>';
const baseURL = config.baseURL;

var transporter = nodemailer.createTransport(smtpTransport({
    host: `${config.email.server}`, // hostname
    secure: false, // use SSL
    port: 25, // port for secure SMTP
    auth: {
        user: config.email.username,
        pass: config.email.password
    },
    tls: {
        rejectUnauthorized: false
    }
}));

Email.isUp = (monitor, response, timeDate) => {
    const newOrder = transporter.templateSender(new EmailTemplate(path.join(templatesDir, 'up')), {
        from: from
    });

    newOrder({
        to: monitor.email,
        subject: `ALERT ${monitor.name} is back online!`,
        priority: 'high'
    }, {
        monitor,
        response,
        timeDate,
        baseURL
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent:', info.response);
        }
    });
};

Email.isDown = (monitor, response, timeDate)=> {
    const newOrder = transporter.templateSender(new EmailTemplate(path.join(templatesDir, 'down')), {
        from: from
    });

    newOrder({
        to: monitor.email,
        subject: `ALERT ${monitor.name} offline!`,
        priority: 'high'
    }, {
        monitor,
        response,
        timeDate,
        baseURL
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent:', info.response);
        }
    });
};

module.exports = Email;