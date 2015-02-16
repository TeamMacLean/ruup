var chalk = require('chalk');

// LOG


var util = {};

function argumentsToString(args) {
    return Array.prototype.slice.call(args).toString().replace(',', ' ');
}

util.logSuccess = function () {
    console.log(chalk.green(argumentsToString(arguments)));
};

util.logInfo = function () {
    console.log(chalk.blue(argumentsToString(arguments)));
};

util.logWarning = function () {
    console.log(chalk.yellow(argumentsToString(arguments)));
};

util.logError = function () {
    console.log(chalk.red(argumentsToString(arguments)));
};

// RENDER

util.renderError = function (err, res) {
    if (err) {
        return res.status(404).render('error', {message: err});
    }
};

// FLASH

util.flashError = function (req, msg) {
    req.flash('error', msg);
};

util.flashSuccess = function (req, msg) {
    req.flash('success', msg);
};

util.flashInfo = function (req, msg) {
    req.flash('info', msg);
};


module.exports = util;