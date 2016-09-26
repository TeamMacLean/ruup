const express = require('express');
const router = express.Router();
const Monitors = require('./controllers/monitors');
const passport = require('passport');

router.route('/')
    .get((req, res) => res.render('index'));

router.route('/auth/github/callback')
    .post(function (req, res, next) {
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
    });

router.route('/me')
    .get(Monitors.mine);

router.route('/signout').get((req, res) => {
    req.logout();
    res.redirect('/');
});

router.route('/new')
    .get(Monitors.new)
    .post(Monitors.newPost);
router.route('/site/:id')
    .get((req, res)=>Monitors.show);
router.route('/site/:id/edit')
    .get((req, res)=>Monitors.edit);
router.route('/site/:id/delete')
    .get((req, res)=>Monitors.delete);

router.route('/badge/:site')
    .get((req, res)=> {
        var site = req.params.site;
        var badge = require('./lib/badge');
        badge.generate(site, Math.floor(Math.random() * 100) + 1 + '%').then(svg=> {
            res.send(svg);
        }).catch(err=> {
            console.log(err)
        })
    });

module.exports = router;