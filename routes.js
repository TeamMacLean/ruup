const express = require('express');
const router = express.Router();
const Monitors = require('./controllers/monitors');
const Auth = require('./controllers/auth');

router.route('/')
    .get((req, res) => {
        if (req.isAuthenticated()) {
            res.render('monitor/mine');
        } else {
            res.render('index');
        }
    });

router.route(['/auth/github', '/signin', '/login'])
    .get(Auth.github);
router.route('/auth/github/callback')
    .get(Auth.githubCallback);

router.route(['/signout', '/logout']).get((req, res) => {
    req.logout();
    res.redirect('/');
});

router.route('/new')
    .all(isAuthenticated)
    .get(Monitors.new)
    .post(Monitors.newPost);
router.route('/site/:id')
    .get((req, res)=>Monitors.show);
router.route('/site/:id/edit')
    .all(isAuthenticated)
    .get((req, res)=>Monitors.edit)
    .all(isAuthenticated);
router.route('/site/:id/delete')
    .get((req, res)=>Monitors.delete);

router.route('/badge/:site')
    .get(Monitors.getBadge);


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        // req.session.returnTo = req.path;
        return res.redirect('/auth/github');
    }
}


module.exports = router;