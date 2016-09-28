const passport = require('passport');
const LOG = require('../lib/log');

var Auth = {};

Auth.github = (req, res, next)=> {
    passport.authenticate('github')(req, res, next);
};

Auth.githubCallback = (req, res, next)=> {
    passport.authenticate('github', (err, user, info) => {
        if (err) {
            LOG.error(err);
            return next(err);
        }
        if (!user) {
            var message = 'No such user';
            if (info && info.message) {
                message += `, ${info.message}`;
            }
            return res.send(message);
        }
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
};

module.exports = Auth;