var Auth = {};

var passport = require('passport');

Auth.github = (req, res, next)=> {
    passport.authenticate('github')(req, res, next);
}

Auth.githubCallback = (req, res, next)=> {
    passport.authenticate('github', (err, user, info) => {
        if (err) {
            // LOG.error(err);
            console.error(err);
            return next(err);
        }
        if (!user) {
            var message = 'No such user';
            if (info && info.message) {
                message += `, ${info.message}`;
            }
            return res.send(message);
            // return renderError(message, res);
            //return res.render('error', {error: message});
        }
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }

            req.user.iconURL = gravatar.url(req.user.mail) || config.defaultUserIcon;

            //take them to the page they wanted before signing in :)
            // if (req.session.returnTo) {
            //     return res.redirect(req.session.returnTo);
            // } else {
            return res.redirect('/');
            // }
        });
    })(req, res, next);
};

module.exports = Auth;