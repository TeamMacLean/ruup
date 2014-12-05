var chalk = require('chalk');

// LOG

function argumentsToString(args) {
    return Array.prototype.slice.call(args).toString().replace(',', ' ');
}

this.logSuccess = function () {
    console.log(chalk.green(argumentsToString(arguments)));
};

this.logInfo = function () {
    console.log(chalk.blue(argumentsToString(arguments)));
};

this.logWarning = function () {
    console.log(chalk.yellow(argumentsToString(arguments)));
};

this.logError = function () {
    console.log(chalk.red(argumentsToString(arguments)));
};

// RENDER

this.renderError = function (err, res) {
    if (err) {
        return res.status(404).render('error', {message: err});
    }
};

// FLASH

this.flashError = function (req, msg) {
    req.flash('error', msg);
};

this.flashSuccess = function (req, msg) {
    req.flash('success', msg);
};

this.flashInfo = function (req, msg) {
    req.flash('info', msg);
};


module.exports = this;