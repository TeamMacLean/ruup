var chalk = require('chalk');

// LOG

this.logSuccess = function (text) {
    console.log(chalk.green(text));
};

this.logInfo = function (text) {
    console.log(chalk.blue(text));
};

this.logWarning = function (text) {
    console.log(chalk.yellow(text));
};

this.logError = function (text) {
    console.log(chalk.red(text));
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